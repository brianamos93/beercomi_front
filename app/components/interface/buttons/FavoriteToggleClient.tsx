"use client";

import { useToggleFavorite } from "@/app/hooks/useToggleFavorite";

type FavoriteType = "beers" | "breweries";

export default function ToggleFavoriteButton({
	type,
	id,
	initialFavorite,
	favorite_id,
}: {
	type: FavoriteType;
	id: string;
	initialFavorite: boolean;
	favorite_id?: string;
}) {
	const { isFavorited, isPending, toggle } = useToggleFavorite({
		type,
		targetId: id,
		initialFavorite,
		initialFavoriteId: favorite_id,
	});

	return (
		<button
			onClick={toggle}
			disabled={isPending}
			className="px-3 py-2 border rounded"
		>
			{isFavorited ? "★ Favorited" : "☆ Favorite"}
		</button>
	);
}
