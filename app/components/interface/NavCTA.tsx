import { getLoggedInUsersData } from "@/app/utils/requests/userRequests";
import Header from "./Header";
import { cookies } from "next/headers";

export default async function NavCTA() {

	let displayName = null
	let profile_img_url = null
	let auth = false
		const cookieStore = await cookies()
		const token = cookieStore.get('token')?.value
		if(token) {
			const userData = await getLoggedInUsersData(token)
			console.log("userData:", userData)
					
			displayName = userData.display_name
			profile_img_url = userData.profile_img_url
			auth = true
		}
	
	if (!token) {
		const user = {
			display_name: null,
			profile_img_url: null,
			isAuthenticated: false,
		}
		return <Header user={user} />
	} else {
	const user = {
		display_name: displayName,
		profile_img_url: profile_img_url,
		isAuthenticated: auth,
	}

	return <Header user={user} />
	}
}