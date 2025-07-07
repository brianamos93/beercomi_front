import { getStore, getStoresList } from "@/app/utils/requests/storeRequests";
import { Store } from "@/app/utils/def";
import { decrypt } from "@/app/utils/requests/userRequests";
import Link from "next/link";
import { cookies } from "next/headers";

export async function generateStaticParams() {
	const stores = await getStoresList()

	return stores.map((store: Store) => ({
		slug: store.id
	}))
}

export default async function StorePage({params}:{params: Promise<{ id: string }> 
}) {
	const session = await (await cookies()).get('session')?.value
	let currentUserId = null
		if(session) {
			const decryptedCookie = await decrypt(session)
			currentUserId = decryptedCookie.userID
		} else {
			currentUserId = null
	
		}
	const store = await getStore((await params).id)
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">{store.name}</h1>
					<ul>
						<li>{store.location}</li>
						<li>{store.date_of_founding}</li>
						<li>{store.owner}</li>
						<li>{new Date(store.date_updated).toLocaleString()}</li>
						{store.author === currentUserId && (
							<li><Link
							href={`/beers/${store.id}/edit`}
							className="text-blue-600 hover:underline font-semibold">Edit</Link></li>
						)}
					</ul>
				</div>
			</main>
	)	
}