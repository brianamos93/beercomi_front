import url from "../utils"
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = "secret"; //change
const key = new TextEncoder().encode(secretKey);



export async function encrypt(payload: any) {
	return await new SignJWT(payload)
	  .setProtectedHeader({ alg: "HS256" })
	  .setIssuedAt()
	  .setExpirationTime("1 hour from now")
	  .sign(key);
  }

export async function decrypt(input: string): Promise<any> {
	try {
		const { payload } = await jwtVerify(input, key, {
		algorithms: ["HS256"],
	});
	return payload;
	} catch (error) {
		console.log("Failed to verify Session")
	}

}


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
		console.log(token)
		const userID = body.userForToken.id
		const displayName = body.userForToken.display_name
		const expires = new Date(Date.now() + 60 * 60* 1000)
		const session = await encrypt({ token, expires, userID});
		(await
			cookies()).set("session", session, { expires, httpOnly: true});
		(await
			cookies()).set("display_name", displayName, { expires, httpOnly: true});
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
	  cookies()).set("session", "", { expires: new Date(0) });
  }

export async function getSession() {
	const session = (await cookies()).get("session")?.value;
	if (!session || typeof session !== "string") return null;
	try {
		return await decrypt(session)
	} catch (err) {
		console.error("Invalid Session Token:", err)
		return null
	}
}