import Header from "./Header";
import { cookies } from "next/headers";

export default async function NavCTA() {
	let session = null
		//const token = (await cookies()).get('session')?.value;
		const cookie = (await cookies()).get('session')?.value
		if(cookie) {
			const decryptedCookie = await decrypt(cookie)
			session = decryptedCookie.token
		}
	
	if (!session) {
		const user = {
			display_name: "Guest",
			isAuthenticated: false,
		}
		return <Header user={user} />
	} else {
	const user = {
		display_name: session.display_name,
		isAuthenticated: Boolean(session.token),
	}

	return <Header user={user} />
	}
}