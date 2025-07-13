import url from "../utils"

export const createReview = async (newReviewData: FormData, token: string) => {
	const res = await fetch(url + '/beers/review', {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({
			review: newReviewData.get('review'),
			rating: newReviewData.get('rating'),
			beer: newReviewData.get('beer'),
		})
	})
	return res.json()
}