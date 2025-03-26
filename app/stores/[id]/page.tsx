import { getStore, getStoresList } from "@/app/utils/storeRequests";
import { Store } from "@/app/utils/def";

export async function generateStaticParams() {
	const stores = await getStoresList()

	return stores.map((store: Store) => ({
		slug: store.id
	}))
}

export default async function StorePage({params}:{params: Promise<{ id: string }> 
}) {
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
					</ul>
				</div>
			</main>
	)	
}