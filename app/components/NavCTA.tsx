import Header from "./Header";
import { cookies } from "next/headers";

export default async function NavCTA() {
	const token = (await cookies()).get('session')?.value;
	const display_name = (await cookies()).get('display_name')?.value;
	
	if (!token) {
		const user = {
			display_name: "Guest",
			isAuthenticated: false,
		}
		return <Header user={user} />
	} else {
	const user = {
		display_name: display_name,
		isAuthenticated: Boolean(token),
	}

	return <Header user={user} />
	}
}