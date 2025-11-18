"use client";

import TableComponents from "./components/TableComponents";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Home() {
	type Entry = {
		id: number | string;
		table_name: string;
		[key: string]: unknown;
	};

	const [entries, setEntries] = useState<Entry[]>([]);
	const [entryDetails, setEntryDetails] = useState<
		Record<string | number, unknown>
	>({});
	const [cursor, setCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const loaderRef = useRef<HTMLDivElement | null>(null);

	// ---- Fetch paginated /recent ----
	const loadMore = useCallback(async () => {
		if (loading) return;
		setLoading(true);

		const url = cursor
			? `http://localhost:3005/recent?cursor=${cursor}`
			: `http://localhost:3005/recent`;

		const res = await fetch(url);
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
			{ threshold: 1 }
		);

		observer.observe(loaderRef.current);

		return () => observer.disconnect();
	}, [loadMore, loaderRef]);

	// ---- Fetch details for each entry (only once per ID) ----
	const fetchedIdsRef = useRef<Set<string | number>>(new Set());
	useEffect(() => {
		entries.forEach((entry) => {
			if (!fetchedIdsRef.current.has(entry.id)) {
				fetchedIdsRef.current.add(entry.id);

				let url = `http://localhost:3005/${entry.table_name}/${entry.id}`;
				if (entry.table_name === "beer_reviews") {
					url = `http://localhost:3005/beers/review/${entry.id}`;
				}

				fetch(url)
					.then((res) => res.json())
					.then((data) => {
						setEntryDetails((prev) => ({
							...prev,
							[entry.id]: data,
						}));
					});
			}
		});
	}, [entries]);

	return (
		<main>
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">Recent Entries</h1>

				<div className="space-y-4">
					{entries.map((entry) => {
						const componentKey =
							entry.table_name as keyof typeof TableComponents;
						const Component =
							TableComponents[componentKey] || TableComponents.default;

						return (
							<Component
								key={entry.id}
								entry={entryDetails[entry.id] || entry}
							/>
						);
					})}
				</div>

				{/* Loader Trigger */}
				<div ref={loaderRef} className="h-12 flex items-center justify-center">
					{loading ? <p>Loading…</p> : <p></p>}
				</div>

				{/* No more pages */}
				{cursor === null && entries.length > 0 && (
					<p className="text-center text-gray-500 py-4">No more entries</p>
				)}
			</div>
		</main>
	);
}
