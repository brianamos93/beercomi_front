"use client";

import { useOptimistic, useTransition } from "react";
import {
	addToFavoritesServer,
	removeFromFavroritesServer,
} from "@/app/actions/favorites";

type FavoriteType = "beers" | "breweries";

export default function ToggleFavoriteButton({
	type,
	id,
	initialFavorite,
  	object,
}: {
	type: FavoriteType;
	id: string;
	initialFavorite: boolean;
  	object: any;
}) {
	const [isPending, startTransition] = useTransition();

	const [optimisticFav, setOptimisticFav] = useOptimistic(
		initialFavorite,
		(_, next: boolean) => next
	);

	function onClick() {
		// Compute the next state once
		const next = !optimisticFav;

		startTransition(async () => {
			// Optimistic update (now inside transition → ✔️ no error)
			const prev = optimisticFav; // store previous state

			setOptimisticFav(next);
			let res
			console.log(optimisticFav)
			try {
				if(optimisticFav === false) {
					res = await addToFavoritesServer(type, id)
				} else {
					res = await removeFromFavroritesServer(object.favorite_detail.id, type, object.id)
				}
				console.log(res)
				setOptimisticFav(res);
			} catch (err) {
				console.error(err);
				setOptimisticFav(prev); // rollback to previous state
			}
		});
	}

	return (
		<button
			onClick={onClick}
			disabled={isPending}
			className="px-3 py-2 border rounded"
		>
			{optimisticFav ? "★ Favorited" : "☆ Favorite"}
		</button>
	);
}
