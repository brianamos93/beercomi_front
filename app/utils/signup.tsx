import url from "./utils"

export const Signup = async (newuserdata: FormData) => {
	const res = await fetch(url + '/signup', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({display_name: newuserdata.get("display_name"), email: newuserdata.get("email"), password: newuserdata.get("password")})
	})
	return res.json()
}