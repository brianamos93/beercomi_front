import { decrypt } from "../utils/requests/userRequests";
import Header from "./Header";
import { cookies } from "next/headers";

export default async function NavCTA() {

	let session = null
	let displayName = null
		//const token = (await cookies()).get('session')?.value;
		const cookie = (await cookies()).get('session')?.value
		if(cookie) {
			const decryptedCookie = await decrypt(cookie)
			session = decryptedCookie.token
			console.log(session)
			displayName = decryptedCookie.displayName
			console.log(decryptedCookie)
		}
	
	if (!session) {
		const user = {
			display_name: "Guest",
			isAuthenticated: false,
		}
		return <Header user={user} />
	} else {
	const user = {
		display_name: displayName,
		isAuthenticated: Boolean(session),
	}

	return <Header user={user} />
	}
}