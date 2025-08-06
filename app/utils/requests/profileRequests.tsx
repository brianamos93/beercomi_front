import url from "../utils"

export const uploadAvatar = async (formData: FormData, token: string) => {
	const res = await fetch(url + '/profile/img/upload', {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData
	})
	return res.json()
}