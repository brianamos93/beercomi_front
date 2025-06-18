import Link from "next/link";
import StoreCard from "../components/StoreCard";
import { getStores } from "../utils/requests/storeRequests"
import { Store } from "../utils/def";

export default async function stores() {
	const data = await getStores()
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">Stores</h1>
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