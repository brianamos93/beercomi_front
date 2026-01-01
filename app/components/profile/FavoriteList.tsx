"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserFavorites } from "@/app/utils/requests/userRequests";

type Favorite = {
	id: string;
	target_id: string;
	name: string;
	brewery_name: string;
	source_table: "beers" | "breweries";
};

type Props = {
	userId: string;
};

export default function UserFavoriteList({ userId }: Props) {
	const [favorites, setFavorites] = useState<Favorite[]>([]);
	const [pagination, setPagination] = useState({
		total: 0,
		limit: 10,
		offset: 0,
	});
	const [loading, setLoading] = useState(false);

	const currentPage =
		Math.floor(pagination.offset / pagination.limit) + 1;

	const totalPages = Math.ceil(
		pagination.total / pagination.limit
	);

	useEffect(() => {
		if (!userId) return;

		const fetchFavorites = async () => {
			setLoading(true);

			try {
				const res = await getUserFavorites(userId, 
					pagination.limit,
					pagination.offset,
				);

				setFavorites(res.data);
				setPagination(res.pagination);
			} finally {
				setLoading(false);
			}
		};

		fetchFavorites();
	}, [userId, pagination.limit, pagination.offset]);

	return (
		<div>
			<h2>Favorites</h2>

			<ul>
				{favorites.map((favorite) => {
					const href = `/${favorite.source_table}/${favorite.target_id}`;
					const label =
						favorite.source_table === "beers"
							? `${favorite.brewery_name}'s ${favorite.name}`
							: favorite.brewery_name;

					return (
						<li key={favorite.id}>
							<Link href={href}>{label}</Link>
						</li>
					);
				})}
			</ul>

			{totalPages > 1 && (
				<div style={{ marginTop: "1rem" }}>
					<button
						type="button"
						disabled={pagination.offset === 0 || loading}
						onClick={() =>
							setPagination((p) => ({
								...p,
								offset: Math.max(p.offset - p.limit, 0),
							}))
						}
					>
						Previous
					</button>

					<span style={{ margin: "0 1rem" }}>
						Page {currentPage} of {totalPages}
					</span>

					<button
						type="button"
						disabled={currentPage >= totalPages || loading}
						onClick={() =>
							setPagination((p) => ({
								...p,
								offset: p.offset + p.limit,
							}))
						}
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
}
