import { getBeer, getBeersList } from "@/app/utils/requests/beerRequests";
import { Beer } from "@/app/utils/def";
import { cookies } from "next/headers";
import { decrypt } from "@/app/utils/requests/userRequests";
import Link from "next/link";

export async function generateStaticParams() {
	const beers = await getBeersList()

	return beers.map((beer: Beer) => ({
		slug: beer.id
	}))
}

export default async function BeerPage({params}:{params: Promise<{ id: string }> 
}) {
	const session = await (await cookies()).get('session')?.value
	let currentUserId = null
	if(session) {
		const decryptedCookie = await decrypt(session)
		currentUserId = decryptedCookie.userID
	} else {
		currentUserId = null

	}
	const beer = await getBeer((await params).id)
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">{beer.name}</h1>
					<ul>
						<li>{beer.brewery_name}</li>
						<li>{beer.description}</li>
						<li>{beer.style}</li>
						<li>{beer.ibu}</li>
						<li>{beer.abv}</li>
						<li>{beer.color}</li>
						<li>{beer.author}</li>
						{beer.author === currentUserId && (
							<li><Link
							href={`/beers/${beer.id}/edit`}
							className="text-blue-600 hover:underline font-semibold">Edit</Link></li>
						)}
					</ul>
				</div>
			</main>

	)	
}