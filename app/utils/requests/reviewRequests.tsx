import { DeletedFilter } from "../def"
import url from "../utils"

export const getReview = async ({id, limit, offset}: {id: string, limit?: number, offset?: number}) => {
	const params = new URLSearchParams();

	if (limit !== undefined) params.append("limit", limit.toString());
	if (offset !== undefined) params.append("offset", offset.toString());

	const query = params.toString();
	
	const res = await fetch(url + `/beers/${id}/review${query ? `?${query}` : ""}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	})
	return res.json()
}

export const getBeerReviews = async ({id, limit, offset}: {id: string, limit: number, offset: number}) => {
	const params = new URLSearchParams();

	if (limit !== undefined) params.append("limit", limit.toString());
	if (offset !== undefined) params.append("offset", offset.toString());

	const query = params.toString();
	
	const res = await fetch(url + `/beers/${id}/reviews${query ? `?${query}` : ""}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	})
	return res.json()
}

export const createReview = async (newReviewData: FormData, token: string) => {
	const res = await fetch(url + '/beers/review', {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,

		},
		body: newReviewData
	})
	return res.json()
}

export const editReview = async (id: string, formData: FormData, token: string) => {
	const res = await fetch(url + `/beers/review/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData
	})
	return res.json()
}

export const adminReviewsGet = async ( {token, limit, offset, deleted}: {token: string, limit: string, offset: string, deleted: DeletedFilter}) => {
	const res = await fetch(url + `/beers/admin/reviews?limit=${limit}&offset=${offset}&deleted=${deleted}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,

		},
	})
	if(!res.ok) throw new Error("Failed to get reviews")
	return res.json()
}

export const softDeleteReview = async (id: string, token: string) => {
	const res = await fetch(
		url + "/beers/review/" + id,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`
			},
		}
	)
	if(!res.ok) throw new Error("Failed to soft delete beer")
	return res.json()
}

export const hardDeleteReview = async (id: string, token: string) => {
	const res = await fetch(
		url + "/beers/admin/hard-delete/review/" + id,
		{
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`
		}
		}
	)
	if(!res.ok) throw new Error("Failed to hard delete beer")
	return res.json()
}

export const undoSoftDeleteReview = async(id: string, token: string) => {
	const res = await fetch(
		url + "/beers/review/delete/undo/" + id, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`
			},
		}
	)
	if(!res.ok) throw new Error("Failed to undo soft delete")
	return res.json()
}