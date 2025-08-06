import { decrypt } from "../../utils/requests/userRequests";
import Header from "./Header";
import { cookies } from "next/headers";

export default async function NavCTA() {

	let session = null
	let displayName = null
	let profile_img_url = null
		//const token = (await cookies()).get('session')?.value;
		const cookie = (await cookies()).get('session')?.value
		if(cookie) {
			const decryptedCookie = await decrypt(cookie)
			session = decryptedCookie.token
			displayName = decryptedCookie.displayName
			profile_img_url = decryptedCookie.profile_img_url
		}
	
	if (!session) {
		const user = {
			display_name: "Guest",
			profile_img_url: "./public/defaultavatar.png",
			isAuthenticated: false,
		}
		return <Header user={user} />
	} else {
	const user = {
		display_name: displayName,
		profile_img_url: profile_img_url,
		isAuthenticated: Boolean(session),
	}

	return <Header user={user} />
	}
}