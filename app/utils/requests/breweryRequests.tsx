import url from "../utils"
import { Brewery } from "../def"

export const getBreweries = async () => {
	const res = await fetch(url + '/breweries')
	return res.json()
}

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

export const createBrewery = async (brewery: Brewery, token: string) => {
	const res = await fetch(url + '/breweries', {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({brewery})
	})
	return res.json()
}

export const updateBrewery = async (id: string, brewery: Brewery, token: string) => {
	const res = await fetch(`${url}/breweries/${id}`,{
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({brewery})
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