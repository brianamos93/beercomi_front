import TableComponents from "@/app/components/TableComponents"
import { getLoggedInUsersData, getRecentActivityOneUser } from "@/app/utils/requests/userRequests"
import { MapPinIcon, PlusIcon } from "@heroicons/react/24/solid"
import { cookies } from "next/headers"
import Image from 'next/image'
import Link from "next/link"

export default async function Profile() {
	const token = await (await cookies()).get("token")?.value;
	let userId = null;
	let userImg = null;
	let userDisplayName = null;
	if (token) {
		const userData = await getLoggedInUsersData(token);
		userId = userData.id;
		userImg = userData.profile_img_url
		userDisplayName = userData.display_name
	}

	const pictureurl = userImg ? `http://localhost:3005${userImg}` : "http://localhost:3005/uploads/defaultavatar.png";
	const altText = userDisplayName ? `${userDisplayName}'s avatar` : "Default Avatar";
	const recentActivity = await getRecentActivityOneUser(userId)

    // Fetch all entry data in parallel
    const entriesArr = await Promise.all(
        recentActivity.map(async (entry) => {
            let url = `http://localhost:3005/${entry.table_name}/${entry.id}`
            if (entry.table_name == 'beer_reviews') {
                url = `http://localhost:3005/beers/review/${entry.id}`
            }
            const res = await fetch(url)
            const data = await res.json()
            return { id: entry.id, data }
        })
    )
    const entries: Record<string, any> = {}
    entriesArr.forEach(({ id, data }) => {
        entries[id] = data
    })
	return (
		<main className="flex flex-col justify-center max-w-2xl mx-auto p-4">
			<div className="flex flex-row justify-center p-4">
				<div className="relative inline-block max-w-[100px] max-h-[100px]">
					<div>
						<Image
						src={pictureurl}
						alt={altText}
						height={200}
						width={200}
						className="rounded-full w-full h-auto block object-cover"
						/>
					</div>
					<div className="absolute right-0 bottom-0">
						<Link href="/users/profile/edit">
						<PlusIcon className="size-8 text-white rounded-full bg-gray-600"/>
						</Link>
					</div>
				</div>
				<div className="p-4">
					<h2 className="text-2xl">{userDisplayName}</h2>
					<div className="flex flex-row">
						<MapPinIcon className="size-5 text-blue-600"/>
						<p className="text-base">Osaka, Japan</p>
					</div>
				</div>
			</div>
			<div className="max-w-[500px] max-w-2xl mx-auto p-4">
				<p className="text-center text-sm">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient.</p>
			</div>
			<div>
				<ul className="space-y-4">
				{recentActivity.map((entry) => {
					type TableComponentKey = keyof typeof TableComponents;
              		const componentKey = entry.table_name as TableComponentKey;
              		const Component = TableComponents[componentKey] || TableComponents.default;
                		return (
                  			<li className="" key={entry.id}>
                  			<Component entry={entries[entry.id]}/>
                  			</li>
						)
				})}
				</ul>
			</div>
		</main>
	)
}