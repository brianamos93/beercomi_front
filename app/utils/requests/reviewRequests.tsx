import url from "../utils"

export const getReview = async (id: string) => {
	const res = await fetch(url + `/beers/review/${id}`, {
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
