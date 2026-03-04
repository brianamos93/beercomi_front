"use client";

import { useEffect, useState } from "react";
import {
	getAllBeers,
	getDeletedBeers,
	hardDeleteBeer,
	softDeleteBeer,
	undoSoftDeleteBeer,
} from "@/app/utils/requests/beerRequests";
import Link from "next/link";
import {
	PencilSquareIcon,
	TrashIcon,
	ArchiveBoxIcon,
	ArrowUturnLeftIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

const LIMIT = 10;

type BeerLog = {
	id: string;
	name: string;
	brewery_name: string;
	style: string;
	abv: number;
	ibu: number;
	color: string;
	date_created: string;
	date_updated: string;
	deleted_at?: string | null;
};

type Category = "all" | "deleted";

export default function BeerTable({ token }: { token: string | undefined }) {
	const [offset, setOffset] = useState(0);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [displayData, setDisplayData] = useState<BeerLog[]>([]);
	const [category, setCategory] = useState<Category>("all");

	const [pendingDelete, setPendingDelete] = useState<string | null>(null);

	const currentPage = Math.floor(offset / LIMIT) + 1;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));

	useEffect(() => {
		const fetchData = async () => {
			if (!token) return;

			setLoading(true);
			setError(null);

			try {
				const res =
					category === "all"
						? await getAllBeers({ token, limit: LIMIT, offset })
						: await getDeletedBeers({ token, limit: LIMIT, offset });

				setDisplayData(res.data ?? []);
				setTotal(res.pagination?.total ?? 0);
			} catch (err) {
				setError("Error loading beers");
				setDisplayData([]);
				setTotal(0);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [offset, category, token]);

	const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newCategory = event.target.value as Category;
		setCategory(newCategory);
		setOffset(0); // reset pagination when switching tables
	};

	const handleSoftDelete = async (id: string) => {
		try {
			await softDeleteBeer(id, token);
			setDisplayData((prev) =>
				prev.map((beer) =>
					beer.id === id
						? { ...beer, deleted_at: new Date().toISOString() }
						: beer,
				),
			);
		} catch (err) {
			setError("Failed to delete beer.");
		} finally {
			setPendingDelete(null);
		}
	};

	const handleUndoSoftDelete = async (id: string) => {
		try {
			await undoSoftDeleteBeer(id, token);
			setDisplayData((prev) =>
				prev.map((beer) =>
					beer.id === id ? { ...beer, deleted_at: null } : beer,
				),
			);
		} catch (err) {
			setError("Failed undo delete");
		} finally {
			setPendingDelete(null);
		}
	};

	const handleHardDelete = async (id: string) => {
		try {
			await hardDeleteBeer(id, token);
			setDisplayData((prev) => prev.filter((beer) => beer.id !== id));
		} catch (err) {
			setError("Failed to delete beer.");
		} finally {
			setPendingDelete(null);
		}
	};

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Beer Log</h2>

			<div>
				<select
					name="category-select"
					id="category-select"
					onChange={handleTableChange}
				>
					<option value="all">All</option>
					<option value="deleted">Deleted</option>
				</select>
			</div>

			{error && <p className="text-red-500 mb-2">{error}</p>}

			<table className="w-full border-collapse border">
				<thead>
					<tr className="bg-gray-100">
						<th className="border px-3 py-2">Name</th>
						<th className="border px-3 py-2">Brewery</th>
						<th className="border px-3 py-2">Style</th>
						<th className="border px-3 py-2">ABV</th>
						<th className="border px-3 py-2">IBU</th>
						<th className="border px-3 py-2">Color</th>
						<th className="border px-3 py-2">Date Created</th>
						<th className="border px-3 py-2">Date Updated</th>
						<th className="border px-3 py-2">Date Deleted</th>
						<th className="border px-3 py-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{loading && (
						<tr>
							<td colSpan={10} className="text-center py-4">
								Loading...
							</td>
						</tr>
					)}

					{displayData.map((log) => (
						<tr key={log.id}>
							<td className="border px-3 py-2">{log.name}</td>
							<td className="border px-3 py-2">{log.brewery_name}</td>
							<td className="border px-3 py-2">{log.style}</td>
							<td className="border px-3 py-2">
								{Number(log.abv.toFixed(1))}%
							</td>
							<td className="border px-3 py-2">{log.ibu}</td>
							<td className="border px-3 py-2">{log.color}</td>
							<td className="border px-3 py-2">
								{new Date(log.date_created).toLocaleString()}
							</td>
							<td className="border px-3 py-2">
								{new Date(log.date_updated).toLocaleString()}
							</td>
							<td className="border px-3 py-2">
								{log.deleted_at
									? new Date(log.deleted_at).toLocaleString()
									: "-"}
							</td>
							<td className="border px-3 py-2 min-w-[10rem]">
								<div className="flex items-center justify-center gap-2">
									<Link
										href={`/beers/${log.id}/edit`}
										className="p-2 rounded-lg hover:bg-gray-200 transition"
										title="Edit"
									>
										<PencilSquareIcon className="h-5 w-5 text-gray-600 hover:text-blue-600" />
									</Link>
									{pendingDelete === log.id ? (
										<div className="flex gap-2">
											<button
												onClick={() =>
													log.deleted_at
														? handleHardDelete(log.id)
														: handleSoftDelete(log.id)
												}
												className="p-2 rounded-lg hover:bg-gray-200 transition"
											>
												<CheckIcon className="h-5 w-5 text-green-600 hover:text-green-800 transition" />
											</button>

											<button
												onClick={() => setPendingDelete(null)}
												className="p-2 rounded-lg hover:bg-gray-200 transition"
											>
												<XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-900 transition" />
											</button>
										</div>
									) : (
										<button
											onClick={() => setPendingDelete(log.id)}
											className="p-2 rounded-lg hover:bg-gray-200 transition"
											title={log.deleted_at ? "Hard Delete" : "Soft Delete"}
										>
											{log.deleted_at ? (
												<TrashIcon className="h-5 w-5 text-red-600 hover:text-red-800" />
											) : (
												<ArchiveBoxIcon className="h-5 w-5 text-gray-600 hover:text-yellow-600" />
											)}
										</button>
									)}
									{log.deleted_at && (
										<button
											onClick={() => handleUndoSoftDelete(log.id)}
											className="p-1 rounded hover:bg-gray-100 transition"
											title="Undelete"
										>
											<ArrowUturnLeftIcon className="h-5 w-5 text-gray-600 hover:text-green-600" />
										</button>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination */}
			<div className="flex items-center justify-between mt-4">
				<button
					onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
					disabled={offset === 0 || loading}
					className="px-3 py-1 border rounded disabled:opacity-50"
				>
					Previous
				</button>

				<span>
					Page {currentPage} of {totalPages}
				</span>

				<button
					onClick={() => setOffset((o) => o + LIMIT)}
					disabled={offset + LIMIT >= total || loading}
					className="px-3 py-1 border rounded disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	);
}
