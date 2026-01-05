"use client";

import { useEffect, useState } from "react";
import { getActivityLog } from "@/app/utils/requests/activityLogRequests";
import { ActivityLogData } from "@/app/utils/def";

const LIMIT = 10;

export default function ActivityLogTable({ token }: { token: string | undefined }) {
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
				setTotal(res.pagination.totalItems);
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

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Activity Log</h2>

			{error && <p className="text-red-500 mb-2">{error}</p>}

			<table className="w-full border-collapse border">
				<thead>
					<tr className="bg-gray-100">
						<th className="border px-3 py-2">User</th>
						<th className="border px-3 py-2">Action</th>
						<th className="border px-3 py-2">Entity</th>
						<th className="border px-3 py-2">Date</th>
					</tr>
				</thead>
				<tbody>
					{logs.length === 0 && !loading && (
						<tr>
							<td colSpan={4} className="text-center py-4">
								No activity found
							</td>
						</tr>
					)}

					{logs.map((log) => (
						<tr key={log.id}>
							<td className="border px-3 py-2">{log.display_name}</td>
							<td className="border px-3 py-2">{log.action}</td>
							<td className="border px-3 py-2">
								{log.entity_type} ({log.entity_id})
							</td>
							<td className="border px-3 py-2">
								{new Date(log.created_at).toLocaleString()}
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
