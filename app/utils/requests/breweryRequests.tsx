import { DeletedFilter } from "../def";
import url from "../utils";

export const getBreweries = async ({
	limit,
	offset,
	q,
}: {
	limit: number;
	offset: number;
	q?: string;
}) => {
	let queryString = "limit=" + limit + "&offset=" + offset;
	if (q) {
		queryString += "&q=" + encodeURIComponent(q);
	}
	const res = await fetch(url + "/breweries?" + queryString, {
		cache: "no-store",
	});

	if (!res.ok) throw new Error("Failed to fetch breweries");

	return res.json();
};

export const getBreweriesOneUser = async (id: string) => {
	const res = await fetch(`${url}/user/${id}/breweries`);
	return res.json();
};

export const getBreweriesList = async () => {
	const res = await fetch(url + "/breweries/list");
	return res.json();
};

export const getBrewery = async (id: string, limit?: number, offset?: number) => {
	const params = new URLSearchParams();

	if (limit !== undefined) params.append("limit", limit.toString());
	if (offset !== undefined) params.append("offset", offset.toString());

	const query = params.toString();

	const res = await fetch(
		`${url}/breweries/${id}${query ? `?${query}` : ""}`,
		{
			cache: "no-store",
		},
	);
	if (!res.ok) throw new Error("Brewery not found");
	return res.json();
};
export const createBrewery = async (
	newBreweryData: FormData,
	token: string,
) => {
	const res = await fetch(url + "/breweries", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: newBreweryData,
	});
	return res.json();
};

export const updateBrewery = async (
	id: string,
	updatedBreweryData: FormData,
	token: string,
) => {
	const res = await fetch(`${url}/breweries/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: updatedBreweryData,
	});
	return res.json();
};

export const deleteBrewery = async (id: string, token: string) => {
	await fetch(`${url}/breweries/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

export const adminBreweryGet = async ({
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
			`/breweries/admin/view?limit=${limit}&offset=${offset}&deleted=${deleted}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return res.json();
};

export const favoriteBreweries = async (token: string) => {
	const res = await fetch(`${url}/favorites/brewereies`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.json();
};

export const softDeleteBrewery = async (id: string, token: string) => {
	const res = await fetch(url + "/breweries/" + id, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error("Failed to soft delete beer");
	return res.json();
};

export const hardDeleteBrewery = async (id: string, token: string) => {
	const res = await fetch(url + "/breweries/admin/hard-delete/" + id, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error("Failed to hard delete beer");
	return res.json();
};

export const undoSoftDeleteBrewery = async (id: string, token: string) => {
	const res = await fetch(url + "/breweries/admin/undo/delete/" + id, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) throw new Error("Failed to undo soft delete");
	return res.json();
};
