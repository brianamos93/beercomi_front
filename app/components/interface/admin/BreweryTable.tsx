"use client";

import { useEffect, useState } from "react";
import {
	hardDeleteBrewery,
	softDeleteBrewery,
	undoSoftDeleteBrewery,
} from "@/app/utils/requests/breweryRequests";
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
import { adminBreweryGet } from "@/app/utils/requests/breweryRequests";
import { DeletedFilter } from "@/app/utils/def";
import { PaginationUI } from "../paginationBase";

const LIMIT = 10;

type BreweryLog = {
	id: string;
	name: string;
	location: string;
	date_of_founding: string;
	date_created: string;
	date_updated: string;
	deleted_at?: string | null;
};

export default function BreweryTable({ token }: { token: string }) {
	const [offset, setOffset] = useState(0);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [displayData, setDisplayData] = useState<BreweryLog[]>([]);
	const [deleted, setDeleted] = useState<DeletedFilter>("all");

	const [pendingDelete, setPendingDelete] = useState<string | null>(null);

	const currentPage = Math.floor(offset / LIMIT) + 1;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));

	useEffect(() => {
		const fetchData = async () => {
			if (!token) return;

			setLoading(true);
			setError(null);

			try {
				const res = await adminBreweryGet({
					token,
					limit: LIMIT.toString(),
					offset: offset.toString(),
					deleted,
				});

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
	}, [offset, deleted, token]);

	const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newDeleted = event.target.value as DeletedFilter;
		setDeleted(newDeleted);
		setOffset(0); // reset pagination when switching tables
	};

	const handleSoftDelete = async (id: string) => {
		try {
			await softDeleteBrewery(id, token);
			setDisplayData((prev) =>
				prev.map((brewery) =>
					brewery.id === id
						? { ...brewery, deleted_at: new Date().toISOString() }
						: brewery,
				),
			);
		} catch (err) {
			setError("Failed to delete brewery.");
		} finally {
			setPendingDelete(null);
		}
	};

	const handleUndoSoftDelete = async (id: string) => {
		try {
			await undoSoftDeleteBrewery(id, token);
			setDisplayData((prev) =>
				prev.map((brewery) =>
					brewery.id === id ? { ...brewery, deleted_at: null } : brewery,
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
			await hardDeleteBrewery(id, token);
			setDisplayData((prev) => prev.filter((brewery) => brewery.id !== id));
		} catch (err) {
			setError("Failed to delete brewery.");
		} finally {
			setPendingDelete(null);
		}
	};

	const renderActions = (log: BreweryLog) => (
		<div className="flex items-center justify-center gap-2">
			<Link
				href={`/breweries/${log.id}/edit`}
				className="p-2 rounded-lg hover:bg-gray-200 transition"
				title="編集"
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
					title={log.deleted_at ? "ハード削除" : "ソフト削除"}
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
					title="復元"
				>
					<ArrowUturnLeftIcon className="h-5 w-5 text-gray-600 hover:text-green-600" />
				</button>
			)}
		</div>
	);

	const columns: Column<BreweryLog>[] = [
		{ header: "ブルワリー名", accessor: (row) => row.name },
		{ header: "住所", accessor: (row) => row.location },
		{ header: "創立年", accessor: (row) => row.date_of_founding },
		{
			header: "作成日",
			accessor: (row) => new Date(row.date_created).toLocaleString(),
		},
		{
			header: "更新日",
			accessor: (row) => new Date(row.date_updated).toLocaleString(),
		},
		{
			header: "削除日",
			accessor: (row) =>
				row.deleted_at ? new Date(row.deleted_at).toLocaleString() : "-",
		},
	];

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">ブルワリーログ</h2>

			<div>
				<select
					name="category-select"
					id="category-select"
					onChange={handleTableChange}
				>
					<option value="all">すべて</option>
					<option value="true">ソフト削除済</option>
					<option value="false">公開中のビール</option>
				</select>
			</div>

			{error && <p className="text-red-500 mb-2">{error}</p>}
			<div className="w-full overflow-x-auto">
				<div className="min-w-[700px]">
					<DataTable
						columns={columns}
						data={displayData}
						loading={loading}
						renderActions={renderActions}
					/>
				</div>
			</div>

			<PaginationUI
				currentPage={currentPage}
				totalPages={totalPages}
				previousAction={() => setOffset((o) => Math.max(0, o - LIMIT))}
				nextAction={() => setOffset((o) => o + LIMIT)}
			/>
		</div>
	);
}
