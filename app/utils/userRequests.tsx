import url from "./utils"
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
	const { payload } = await jwtVerify(input, key, {
	algorithms: ["HS256"],
	});
return payload;
}

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

export const Login = async (formData: FormData) => {
	const res = await fetch(url + '/login', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({email: formData.get("email"), password: formData})
	})
	if (res.status == 200) {
		const body = await res.json()
		const token = body.token
		const userID = body.userFOrToken.id
		const expires = new Date(Date.now() + 60 * 60* 1000)
		const session = await encrypt({ token, expires, userID});
		(await
			cookies()).set("session", session, { expires, httpOnly: true});
	} else {
		return JSON.stringify({"Message": "Error"})
	}
}

export async function logout() {
	// Destroy the session
	(await
	  // Destroy the session
	  cookies()).set("session", "", { expires: new Date(0) });
  }

export async function getSession() {
	const session = (await cookies()).get("session")?.value;
	if (!session) return null;
	return await decrypt(session);
}