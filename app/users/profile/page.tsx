import UserFavoriteList from "@/app/components/profile/FavoriteList";
import TableComponents from "@/app/components/TableComponents";
import { Entry } from "@/app/utils/def";
import {
	getLoggedInUsersData,
	getRecentActivityOneUser,
} from "@/app/utils/requests/userRequests";
import url from "@/app/utils/utils";
import { MapPinIcon, PlusIcon } from "@heroicons/react/24/solid";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Profile() {
	const token = await (await cookies()).get("token")?.value;
	let userId = null;
	let userImg = null;
	let userDisplayName = null;
	let userLocation = "unknown";
	if (token) {
		const userData = await getLoggedInUsersData();
		userId = userData.id;
		userImg = userData.profile_img_url;
		userDisplayName = userData.display_name;
		if (userData.present_location !== null) {
			userLocation = userData.present_location;
		}
	}

	const pictureurl = userImg ? userImg : "/defaultavatar.png";

	const altText = userDisplayName
		? `${userDisplayName}'s avatar`
		: "Default Avatar";

	const recentActivity = await getRecentActivityOneUser(userId);

	// Fetch all entry data in parallel
	const entriesArr = await Promise.all(
		recentActivity.map(async (entry: Entry) => {
			try {
				let activityurl = `${url}/${entry.table_name}/${entry.id}`;
				if (entry.table_name === "beer_reviews") {
					activityurl = `${url}/beers/review/${entry.id}`;
				}
				const res = await fetch(activityurl);

				if (!res.ok) {
					// fallback for server error
					return {
						id: entry.id,
						data: null,
						error: `Server returned ${res.status}`,
					};
				}

				const data = await res.json();
				return { id: entry.id, data, error: null };
			} catch (err) {
				return { id: entry.id, data: null, error: (err as Error).message };
			}
		}),
	);

	const entries: Record<string, { data: any | null; error: string | null }> =
		{};

	entriesArr.forEach(({ id, data, error }) => {
		entries[id] = { data, error };
	});

	return (
		<main className="flex flex-col items-center max-w-4xl mx-auto p-6 space-y-8">
			{/* Profile Header */}
			<div className="flex flex-col items-center md:flex-row md:items-center md:justify-center w-full space-y-4 md:space-y-0 md:space-x-6">
				<div className="relative w-32 h-32 md:w-28 md:h-28">
					<Image
						src={pictureurl}
						alt={altText}
						height={200}
						width={200}
						className="rounded-full w-full h-full object-cover"
					/>
					<div className="absolute right-0 bottom-0">
						<Link href="/users/profile/edit">
							<PlusIcon className="w-8 h-8 text-white rounded-full bg-gray-600 p-1" />
						</Link>
					</div>
				</div>
				<div className="text-center md:text-left">
					<h2 className="text-2xl font-semibold">{userDisplayName}</h2>
					<div className="flex items-center justify-center md:justify-start space-x-2 mt-1 text-blue-600">
						<MapPinIcon className="w-5 h-5" />
						<p className="text-base text-gray-700">{userLocation}</p>
					</div>
				</div>
			</div>
			{/* Bio / Description */}
			<div className="w-full max-w-2xl text-center px-4">
				<p className="text-sm text-gray-600">
					Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
					commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
					et magnis dis parturient.
				</p>
			</div>
			{/* Recent Activity */}
			<div className="w-full max-w-4xl px-4 mx-auto">
				<h2 className="text-xl font-semibold mb-4 text-center">
					Recent Activity
				</h2>
				<ul className="space-y-4 flex flex-col items-center">
					{recentActivity?.map((entry: Entry) => {
						type TableComponentKey = keyof typeof TableComponents;
						const componentKey = entry.table_name as TableComponentKey;
						const Component =
							TableComponents[componentKey] || TableComponents.default;
						const entryData = entries[entry.id];

						if (!entryData || entryData.error) {
							return (
								<li key={entry.id} className="w-full max-w-md">
									{entryData?.error || "Failed to load entry"}
								</li>
							);
						}

						return (
							<li key={entry.id} className="w-full max-w-md">
								<Component entry={entryData.data} />
							</li>
						);
					})}
				</ul>
			</div>
			{/* Favorites */}
			<div className="w-full max-w-4xl px-4 mx-auto">
				<h2 className="text-xl font-semibold mb-4 text-center">Favorites</h2>
				<UserFavoriteList userId={userId} />
			</div>
		</main>
	);
}
