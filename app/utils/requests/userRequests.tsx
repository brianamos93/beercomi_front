'use server'
import url from "../utils"
import { cookies } from "next/headers";

export const Login = async (formData: FormData) => {
	const res = await fetch(url + '/login', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: formData.get("email"), 
			password: formData.get("password")
		})
	})
	if (res.status == 200) {
		const body = await res.json()
		const token = body.token
		const userData = body.userForToken
		const expires = new Date(Date.now() + 60 * 60 * 1000)

		const cookieStore = await cookies()
		
		cookieStore.set({
			name: 'token',
			value: token,
			httpOnly: true,
			path: '/',
			expires: expires,
		});
		cookieStore.set({
			name: 'userData',
			value: userData,
			httpOnly: true,
			path: '/',
			expires: expires,
		});
	} else {
		return JSON.stringify({"Message": "Error"})
	}
}
export const getOneUser = async (id: string) => {
	const res = await fetch(`${url}/user/${id}`)
	return res.json()
}

export async function logout() {
	// Destroy the session
	(await
	  // Destroy the session
	  cookies()).set("token", "", { expires: new Date(0) });
  
  (await
	  // Destroy the session
	  cookies()).set("userData", "", { expires: new Date(0) });
  }

export const getRecentActivityOneUser = async (userId: string) => {
	const res = await fetch(url + `/user/${userId}/recentactivity`)
	return res.json()
}

export const getLoggedInUsersData = async (token: string) => {
	const res = await fetch(url + '/user', {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",

		}})
	return res.json()
}