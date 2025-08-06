import { decrypt, getOneUser } from "@/app/utils/requests/userRequests"
import { cookies } from "next/headers"
import Image from 'next/image'
import Link from "next/link"

export default async function Profile() {
	const session = await (await cookies()).get('session')?.value
	let currentUserId = null
	if(session) {
		const decryptedCookie = await decrypt(session)
		currentUserId = decryptedCookie.userID
	} else {
		currentUserId = null

	}
	const user = await getOneUser(currentUserId)
	const pictureurl = user.profile_img_url ? `http://localhost:3005/uploads/${user.profile_img_url}` : "http://localhost:3005/uploads/defaultavatar.png";
	const altText = user.profile_img_url ? `${user.display_name}'s avatar` : "Default Avatar";
	return (
		<main>
			<div>
				<div>
					<Image
					src={pictureurl}
					alt={altText}
					height={200}
					width={200}
					className="rounded-full max-w-full h-auto"
					/>
				</div>
				<Link href="/users/profile/edit"
				>
					Edit
				</Link>
			</div>
		</main>
	)
}