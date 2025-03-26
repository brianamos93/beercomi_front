import url from "./utils"
import { Beer } from "./def"

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
	return res.json()
}

export const createBeer = async (beer: Beer, token: string) => {
	const res = await fetch(url + '/beers', {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({beer})
	})
	return res.json()
}

export const updateBeer = async (id: string, beer: Beer, token: string) => {
	const res = await fetch(`${url}/beers/${id}`,{
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({beer})
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