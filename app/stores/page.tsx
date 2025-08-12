import Link from "next/link";
import StoreCard from "../components/store/StoreCard";
import { getStores } from "../utils/requests/storeRequests"
import { Store } from "../utils/def";
import { cookies } from "next/headers";

export default async function stores() {
	const data = await getStores()

	const token = await (await cookies()).get('token')?.value
	
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">Stores</h1>
					{token !== null && (
							<Link href="/stores/new"><h2>New Store</h2></Link>
						)}
					<ul className="space-y-4">
					{data.map((store: Store) => (
						<li key={store.id}>
							<StoreCard entry={store} />
						</li>
					))}
					</ul>
				</div>
			</main>
	)
}