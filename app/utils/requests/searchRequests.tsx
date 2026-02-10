import url from "../utils"

export const getSearch = async (query: string, limit: number, offset: number) => {
	const res = await fetch(`${url}/search?q=${query}&limit=${limit}&offset=${offset}`,
		{ cache: "no-store" }
	)
	if (!res.ok) throw new Error("Failed to fetch search results.")
	return res.json()
}