import { getLoggedInUsersData } from "@/app/utils/requests/userRequests";
import Header from "./Header";
import { cookies } from "next/headers";

export default async function NavCTA() {

	let displayName = null
	let profile_img_url = null
		//const token = (await cookies()).get('session')?.value;
		const token = (await cookies()).get('token')?.value
		if(token) {
			const userData = await getLoggedInUsersData(token)
		
			displayName = userData.display_name
			profile_img_url = userData.profile_img_url
		}
	
	if (!token) {
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
		isAuthenticated: Boolean(token),
	}

	return <Header user={user} />
	}
}