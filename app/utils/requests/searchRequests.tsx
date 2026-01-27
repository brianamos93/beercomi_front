import url from "../utils"

export const getSearch = async (query: string, limit: string, offset: string) => {
	const res = await fetch(`${url}/search?query=${query}&limit=${limit}&offset=${offset}`,
		{ cache: "no-store" }
	)
	if (!res.ok) throw new Error("Failed to fetch search results.")
	return res.json()
}