import { DeletedFilter } from "../def";
import url from "../utils";

export const getBeers = async ({
	limit,
	offset,
}: {
	limit: number;
	offset: number;
}) => {
	const res = await fetch(
		url + "/beers?" + "limit=" + limit + "&offset=" + offset,
		{ cache: "no-store" },
	);
	if (!res.ok) throw new Error("Failed to fetch beers");
	return res.json();
};

export const getAdminBeers = async ({
	token,
	limit,
	offset,
	deleted,
}: {
	token: string;
	limit: string;
	offset: string;
	deleted: DeletedFilter;
}) => {
	const res = await fetch(
		url +
			`/beers/admin/beers?limit=${limit}&offset=${offset}&deleted=${deleted}`,
		{
			cache: "no-store",
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	if (!res.ok) throw new Error("Failed to fetch beers");
	return res.json();
};

export const softDeleteBeer = async (id: string, token: string) => {
	const res = await fetch(url + "/beers/" + id, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error("Failed to soft delete beer");
	return res.json();
};

export const hardDeleteBeer = async (id: string, token: string) => {
	const res = await fetch(url + "/beers/admin/hard-delete/beer/" + id, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error("Failed to hard delete beer");
	return res.json();
};

export const undoSoftDeleteBeer = async (id: string, token: string) => {
	const res = await fetch(url + "/beers/admin/undo/delete/" + id, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error("Failed to undo soft delete");
	return res.json();
};

export const getBeersOneUser = async (id: string) => {
	const res = await fetch(`${url}/user/${id}/beers`);
	return res.json();
};

export const getBeersList = async () => {
	const res = await fetch(url + "/beers/list");
	return res.json();
};

export const getBeer = async (id: string, limit?: number, offset?: number) => {
	const params = new URLSearchParams();

	if (limit !== undefined) params.append("limit", limit.toString());
	if (offset !== undefined) params.append("offset", offset.toString());

	const query = params.toString();
	const requestUrl = `${url}/beers/${id}${query ? `?${query}` : ""}`;

	const res = await fetch(requestUrl, {
		cache: "no-store",
	});

	if (!res.ok) throw new Error("Beer not found");
	return res.json();
};
export const createBeer = async (newBeerData: FormData, token: string) => {
	const res = await fetch(url + "/beers", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: newBeerData,
	});
	return res.json();
};

export const updateBeer = async (
	id: string,
	updatedBeerData: FormData,
	token: string,
) => {
	const res = await fetch(`${url}/beers/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: updatedBeerData,
	});
	return res.json();
};

export const deleteBeer = async (id: string, token: string) => {
	await fetch(`${url}/beers/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

export const favoriteBeers = async (token: string) => {
	const res = await fetch(`${url}/favorites/beers`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.json();
};
