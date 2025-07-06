import url from "../utils"

export const getBeers = async () => {
	const res = await fetch(url + '/beers')
	return res.json()
}

export const getBeersOneUser = async (id: string) => {
	const res = await fetch(`${url}/user/${id}/beers`)
	return res.json()
}

export const getBeersList = async () => {
	const res = await fetch(url + '/beers/list')
	return res.json()
}

export const getBeer = async (id: string) => {
	const res = await fetch(`${url}/beers/${id}`)
	if (!res.ok) throw new Error('Beer not found')
	return res.json()
}

export const createBeer = async (newBeerData: FormData, token: string) => {
	const res = await fetch(url + '/beers', {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({
			name: newBeerData.get('name'),
			style: newBeerData.get('style'),
			abv: newBeerData.get('abv'),
			brewery_id: newBeerData.get('brewery_id'),
			description: newBeerData.get('description'),
			ibu: newBeerData.get('ibu'),
			color: newBeerData.get('color'),
		})
	})
	return res.json()
}

export const updateBeer = async (id: string, updatedBeerData: FormData, token: string) => {
	const res = await fetch(`${url}/beers/${id}`,{
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({
			name: updatedBeerData.get('name'),
			style: updatedBeerData.get('style'),
			abv: updatedBeerData.get('abv'),
			brewery_id: updatedBeerData.get('brewery_id'),
			description: updatedBeerData.get('description'),
			ibu: updatedBeerData.get('ibu'),
			color: updatedBeerData.get('color'),
		})
	})
	return res.json()
}

export const deleteBeer = async (id: string, token: string) => {
	await fetch(`${url}/beers/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		}
	})
}