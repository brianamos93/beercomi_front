"use client";

import TableComponents from "./components/TableComponents";
import { useEffect, useState, useRef, useCallback } from "react";
import url from "./utils/utils";
import { TableEntry } from "./components/TableComponents";

type TableComponentProps = {
	entry: TableEntry;
};

export default function Home() {
	const [entries, setEntries] = useState<TableEntry[]>([]);
	const [entryDetails, setEntryDetails] = useState<
		Record<string | number, TableEntry>
	>({});
	const [cursor, setCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const loaderRef = useRef<HTMLDivElement | null>(null);

	// ---- Fetch paginated /recent ----
	const loadMore = useCallback(async () => {
		if (loading) return;
		setLoading(true);

		const cursorurl = cursor
			? `${url}/recent?cursor=${cursor}`
			: `${url}/recent`;

		const res = await fetch(cursorurl, { cache: 'no-store' });
		const json = await res.json();

		setEntries((prev) => [...prev, ...json.data]);
		setCursor(json.nextCursor);
		setLoading(false);
	}, [cursor, loading]);

	// ---- IntersectionObserver Trigger ----
	useEffect(() => {
		if (!loaderRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ threshold: 1 },
		);

		observer.observe(loaderRef.current);

		return () => observer.disconnect();
	}, [loadMore]);

	// ---- Fetch details for each entry (only once per ID) ----
	const fetchedIdsRef = useRef<Set<string | number>>(new Set());

	useEffect(() => {
		entries.forEach((entry) => {
			if (!fetchedIdsRef.current.has(entry.id)) {
				fetchedIdsRef.current.add(entry.id);

				let urlRef = `${url}/${entry.table_name}/${entry.id}`;
				if (entry.table_name === "beer_reviews") {
					urlRef = `${url}/beers/review/${entry.id}`;
				}

				fetch(urlRef)
					.then((res) => res.json())
					.then((data: TableEntry) => {
						setEntryDetails((prev) => ({
							...prev,
							[entry.id]: data,
						}));
					});
			}
		});
	}, [entries]);

	return (
		<main className="flex justify-center">
			<div className="max-w-2xl w-full p-4">
				<h1 className="text-2xl font-bold mb-4">最近の投稿</h1>

				<ul className="space-y-4 flex flex-col items-center">
					{entries.map((entry) => {
						const componentKey =
							entry.table_name as keyof typeof TableComponents;

						const Component = (TableComponents[componentKey] ??
							TableComponents.default) as React.ComponentType<TableComponentProps>;

						return (
							<li className="w-full max-w-md"
              key={entry.id}>
                <Component
                  entry={entryDetails[entry.id] ?? entry}
                />
              </li>
						);
					})}
				</ul>

				{/* Loader Trigger */}
				<div ref={loaderRef} className="h-12 flex items-center justify-center">
					{loading ? <p>読み込み中…</p> : <p></p>}
				</div>

				{/* No more pages */}
				{cursor === null && entries.length > 0 && (
					<p className="text-center text-gray-500 py-4">これ以上の投稿はありません。</p>
				)}
			</div>
		</main>
	);
}
