import Link from "next/link";
import StoreCard from "../components/store/StoreCard";
import { getStores } from "../utils/requests/storeRequests"
import { Store } from "../utils/def";
import { cookies } from "next/headers";
import { getSession, decrypt } from "../utils/requests/userRequests";

export default async function stores() {
	const data = await getStores()

	const session = await (await cookies()).get('session')?.value
	getSession()
		let loggedIn = false
		if(session) {
			const decryptedCookie = await decrypt(session)
			 if(decryptedCookie.token)
			 {
				loggedIn = true
			 }
		} else {
			loggedIn = false
	
		}
	
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">Stores</h1>
					{loggedIn === true && (
							<Link href="/stores/new"><h2>New Store</h2></Link>
						)}
					<ul className="space-y-4">
					{data.map((store: Store) => (
						<li key={store.id}>
							<Link href={`/stores/${store.id}`}>
							<StoreCard entry={store} />
							</Link>
						</li>
					))}
					</ul>
				</div>
			</main>
	)
}