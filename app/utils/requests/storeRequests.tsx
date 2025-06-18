import url from "../utils"
import { Store } from "../def"

export const getStores = async () => {
	const res = await fetch(url + '/stores')
	return res.json()
}

export const getStoresOneUser = async (id: string) => {
	const res = await fetch(`${url}/user/${id}/storeies`)
	return res.json()
}

export const getStoresList = async () => {
	const res = await fetch(url + '/stores/all')
	return res.json()
}

export const getStore = async (id: string) => {
	const res = await fetch(`${url}/stores/${id}`)
	return res.json()
}

export const createStore = async (store: Store, token: string) => {
	const res = await fetch(url + '/stores', {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({store})
	})
	return res.json()
}

export const updateStore = async (id: string, store: Store, token: string) => {
	const res = await fetch(`${url}/stores/${id}`,{
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		},
		body: JSON.stringify({store})
	})
	return res.json()
}

export const deleteStore = async (id: string, token: string) => {
	await fetch(`${url}/stores/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		}
	})
}