"use client";

import { useEffect, useOptimistic, useState, useTransition } from "react";
import {
	addToFavoritesServer,
	removeFromFavroritesServer,
} from "@/app/actions/favorites";

type FavoriteType = "beers" | "breweries";

export function useToggleFavorite({
	type,
	targetId,
	initialFavorite,
	initialFavoriteId,
}: {
	type: FavoriteType;
	targetId: string;
	initialFavorite: boolean;
	initialFavoriteId?: string;
}) {
	const [isPending, startTransition] = useTransition();

	const [favoriteId, setFavoriteId] = useState<string | undefined>(
		initialFavoriteId
	);

	// Sync favoriteId state when the prop changes (e.g., after page revalidation)
	useEffect(() => {
		setFavoriteId(initialFavoriteId);
	}, [initialFavoriteId]);

	const [optimisticFav, setOptimisticFav] = useOptimistic(
		initialFavorite,
		(_, next: boolean) => next
	);

	function toggle() {
		const next = !optimisticFav;
		const prev = optimisticFav;

		startTransition(async () => {
			setOptimisticFav(next);

			try {
				if (!prev) {
					// ADD
					const newId = await addToFavoritesServer(type, targetId);
					setFavoriteId(newId);
				} else {
					// REMOVE
					if (!favoriteId) throw new Error("Missing favoriteId");
					await removeFromFavroritesServer(favoriteId, type, targetId);
					setFavoriteId(undefined);
				}
			} catch (err) {
				console.error(err);
				setOptimisticFav(prev); // rollback UI
			}
		});
	}

	return {
		isFavorited: optimisticFav,
		isPending,
		toggle,
	};
}
