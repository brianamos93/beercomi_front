"use client";

import { useEffect, useState } from "react";
import { getActivityLog } from "@/app/utils/requests/activityLogRequests";
import { ActivityLogData } from "@/app/utils/def";
import { Column, DataTable } from "../interface/table/DataTable";
import { PaginationUI } from "../interface/paginationBase";

const LIMIT = 10;

export default function ActivityLogTable({
	token,
}: {
	token: string | undefined;
}) {
	const [logs, setLogs] = useState<ActivityLogData[]>([]);
	const [offset, setOffset] = useState(0);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadLogs = async () => {
			setLoading(true);
			setError(null);

			try {
				const res = await getActivityLog({
					token,
					limit: LIMIT,
					offset,
				});

				setLogs(res.data);
				setTotal(res.pagination.total);
			} catch (err) {
				setError("Failed to load activity log");
			} finally {
				setLoading(false);
			}
		};

		loadLogs();
	}, [token, offset]);

	const currentPage = Math.floor(offset / LIMIT) + 1;
	const totalPages = Math.ceil(total / LIMIT);

	const columns: Column<ActivityLogData>[] = [
		{ header: "User", accessor: (row) => row.display_name },
		{ header: "Action", accessor: (row) => row.action },
		{ header: "Entity Type", accessor: (row) => row.entity_type },
		{ header: "Entity ID", accessor: (row) => row.entity_id },
		{ header: "Metadata", accessor: (row) => row.metadata },

		{
			header: "Date",
			accessor: (row) => new Date(row.created_at).toLocaleString(),
		},
	];

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Activity Log</h2>

			{error && <p className="text-red-500 mb-2">{error}</p>}
			<div className="w-full overflow-x-auto">
				<div className="min-w-[700px]">
					<DataTable columns={columns} data={logs} loading={loading} />
					<PaginationUI 
						currentPage={currentPage}
						totalPages={totalPages}
						previousAction={() => setOffset((o) => Math.max(0, o - LIMIT))}
						nextAction={() => setOffset((o) => o + LIMIT)}
					/>
				</div>
			</div>
		</div>
	);
}
