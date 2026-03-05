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
import { Column, DataTable } from "../table/DataTable";
import { Pagination } from "../Pagination";

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

export default function BeerTable({ token }: { token: string }) {
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

	const renderActions = (log: BeerLog) => (
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
	);

	const columns: Column<BeerLog>[] = [
		{ header: "Name", accessor: (row) => row.name },
		{ header: "Brewery", accessor: (row) => row.brewery_name },
		{ header: "Style", accessor: (row) => row.style },
		{ header: "ABV", accessor: (row) => `${row.abv.toFixed(1)}%` },
		{ header: "IBU", accessor: (row) => row.ibu },
		{ header: "Color", accessor: (row) => row.color },
		{
			header: "Date Created",
			accessor: (row) => new Date(row.date_created).toLocaleString(),
		},
		{
			header: "Date Updated",
			accessor: (row) => new Date(row.date_updated).toLocaleString(),
		},
		{
			header: "Date Deleted",
			accessor: (row) =>
				row.deleted_at ? new Date(row.deleted_at).toLocaleString() : "-",
		},
	];

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

			<DataTable
				columns={columns}
				data={displayData}
				loading={loading}
				renderActions={renderActions}
			/>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPrevious={() => setOffset((o) => Math.max(0, o - LIMIT))}
				onNext={() => setOffset((o) => o + LIMIT)}
				disabled={loading}
			/>
		</div>
	);
}
