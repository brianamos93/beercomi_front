"use server";

import { cookies } from "next/headers";
import {
	addToFavorites,
	removeFromFavorites,
} from "../utils/requests/favoriteRequests";
import { revalidatePath } from "next/cache";

export async function addToFavoritesServer(table: string, target_id: string) {
	const token = (await cookies()).get("token")?.value;

	if (!token) {
		return { error: "Not Logged In", status: 401, isFavorite: false };
	}

	try {
		const res = await addToFavorites(table, target_id, token);

		if (res.status === 200) {
			console.log("pos",res);
			return { status: 200, isFavorite: true };
		} else {
			console.log("neg",res[0].errors);

			return { status: 500, isFavorite: false };
		}
	} catch (error) {
		console.log(error);
		return {
			error: "Unexpected server error",
			status: 500,
			isFavorite: false,
		};
	} finally {
		revalidatePath(`/${table}/${target_id}`);
	}
}

export async function removeFromFavroritesServer(
	id: string,
	table: string,
	target_id: string
) {
	const token = (await cookies()).get("token")?.value;

	if (!token) {
		return { error: "Not Logged In", status: 401, isFavorite: false };
	}

	try {
		const res = await removeFromFavorites(id, table, token);
		if (res.status === 200) {
			return { status: 200, isFavorite: false };
		} else {
			return { status: 500, isFavorite: true };
		}
	} catch (error) {
		console.log(error);
		return {
			error: "Unexpected server error",
			status: 500,
			isFavorite: true,
		};
	} finally {
		revalidatePath(`/${table}/${target_id}`);
	}
}
