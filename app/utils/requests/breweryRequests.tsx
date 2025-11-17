import url from "../utils"

export const getBreweries = async ({ limit, page }: { limit: number; page: number }) => {
  const res = await fetch(
    url + "/breweries?" + "limit=" + limit + "&page=" + page,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch breweries");

  return res.json();
};


export const getBreweriesOneUser = async (id: string) => {
	const res = await fetch(`${url}/user/${id}/breweryies`)
	return res.json()
}

export const getBreweriesList = async () => {
	const res = await fetch(url + '/breweries/list')
	return res.json()
}

export const getBrewery = async (id: string) => {
	const res = await fetch(`${url}/breweries/${id}`)
	return res.json()
}

export const createBrewery = async (newBreweryData:FormData, token: string) => {
	const res = await fetch(url + '/breweries', {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,

		},
		body: newBreweryData
	})
	return res.json()
}

export const updateBrewery = async (id: string, updatedBreweryData: FormData, token: string) => {
	const res = await fetch(`${url}/breweries/${id}`,{
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,

		},
		body: updatedBreweryData
	})
	return res.json()
}

export const deleteBrewery = async (id: string, token: string) => {
	await fetch(`${url}/breweries/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		}
	})
}