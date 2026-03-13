"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserFavorites } from "@/app/utils/requests/userRequests";
import { getBeer } from "@/app/utils/requests/beerRequests";
import { getBrewery } from "@/app/utils/requests/breweryRequests";
import BeerCard from "../beer/BeerCard";
import BreweryCard from "../brewery/BreweryCard";
import { PaginationUI } from "../interface/paginationBase";

type Favorite = {
	id: string;
	target_id: string;
	name: string;
	brewery_name: string;
	brewery_id: string;
	source_table: "beers" | "breweries";
	date_created: Date;
};

type Props = { userId: string };

export default function UserFavoriteList({ userId }: Props) {
	const [favorites, setFavorites] = useState<Favorite[]>([]);
	const [favoriteData, setFavoriteData] = useState<any[]>([]); // resolved beer/brewery data
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		total: 0,
		limit: 10,
		offset: 0,
	});
	const [loading, setLoading] = useState(false);

	const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
	const totalPages = Math.ceil(pagination.total / pagination.limit);

	const fetchFavorites = useCallback(
		async (resetOffset = false) => {
			if (!userId) return;

			const offsetToUse = resetOffset ? 0 : pagination.offset;
			setLoading(true);
			if (resetOffset) setError(null);

			try {
				// Fetch the favorites list
				const res = await getUserFavorites(
					userId,
					pagination.limit,
					offsetToUse,
				);
				setFavorites(res.data);
				setPagination((prev) => ({ ...res.pagination, offset: offsetToUse }));

				// Fetch the actual beer/brewery data in parallel
				const dataPromises = res.data.map((fav: Favorite) =>
					fav.source_table === "beers"
						? getBeer(fav.target_id)
						: getBrewery(fav.target_id),
				);
				const resolvedData = await Promise.all(dataPromises);
				setFavoriteData(resolvedData);
			} catch (err) {
				setError("Failed to load favorites");
			} finally {
				setLoading(false);
			}
		},
		[userId, pagination.limit, pagination.offset],
	);

	useEffect(() => {
		fetchFavorites();
	}, [fetchFavorites]);

	return (
		<>
			{/* Error Message */}
			{error && (
				<div className="w-full bg-red-100 text-red-700 border border-red-400 rounded-md p-4 flex flex-col items-center space-y-2">
					<p>{error}</p>
					<button
						onClick={() => fetchFavorites(true)}
						disabled={loading}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
					>
						{loading ? "Retrying..." : "Retry"}
					</button>
				</div>
			)}
			{/* Loading State */}
			{loading && (
				<p className="text-gray-500 text-center">Loading favorites...</p>
			)}
			{/* Favorites List */}
			<ul className="space-y-4 flex flex-col items-center">
				{favoriteData.map((entry, index) => {
					const fav = favorites[index];
					return (
						<li key={fav.id} className="w-full max-w-md">
							{fav.source_table === "beers" ? (
								<BeerCard entry={entry} />
							) : (
								<BreweryCard entry={entry} />
							)}
						</li>
					);
				})}
			</ul>
			{/* Pagination */}
			{totalPages > 1 && (
				<div className="w-full flex justify-center mt-4">
					<PaginationUI currentPage={currentPage} totalPages={totalPages} />
				</div>
			)}
		</>
	);
}
