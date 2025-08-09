import { decrypt, getOneUser } from "@/app/utils/requests/userRequests"
import { PlusIcon } from "@heroicons/react/24/solid"
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
		<main className="flex flex-col">
			<div className="flex flex-row justify-center p-4">
				<div className="relative">
					<div>
						<Image
						src={pictureurl}
						alt={altText}
						height={100}
						width={100}
						className="rounded-full max-w-full h-auto"
						/>
					</div>
					<div className="absolute right-0 bottom-0">
						<Link href="/users/profile/edit">
						<PlusIcon className="size-8 text-white rounded-full bg-gray-600"/>
						</Link>
					</div>
				</div>
				<div className="p-4">
					<h2 className="text-3xl">{user.display_name}</h2>
					<p className="">Osaka, Japan</p>
				</div>
			</div>
		</main>
	)
}