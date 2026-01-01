import url from "../utils";

export const addToFavorites = async (table: string, target_id: string, token: string) => {
	const res = await fetch(url + "/favorites", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			table: table,
			target_id: target_id
		})
	})
	return res.json()
}

export const removeFromFavorites = async(id: string, table: string, token: string) => {
	const res = await fetch(url + "/favorites/" + table + '/' + id,{
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		}
	})
	return res.json()
}

export const checkFavorite = async(id: string, table: string, token: string) => {
	const res = await fetch(url + "/favorites/" + table + "/" + id, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		}
	})
	return res.json()
}