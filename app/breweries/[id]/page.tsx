import { getBrewery, getBreweriesList } from "@/app/utils/requests/breweryRequests";
import { Beer, Brewery } from "@/app/utils/def";
import Link from "next/link";
import { decrypt } from "@/app/utils/requests/userRequests";
import { cookies } from "next/headers";
import BeerCard from "@/app/components/beer/BeerCard";

export async function generateStaticParams() {
	const breweries = await getBreweriesList()

	return breweries.map((brewery: Brewery) => ({
		slug: brewery.id
	}))
}

export default async function BreweryPage({params}:{params: Promise<{ id: string }> 
}) {
	const session = await (await cookies()).get('session')?.value
	let currentUserId = null
	if(session) {
		const decryptedCookie = await decrypt(session)
		currentUserId = decryptedCookie.userID
	} else {
		currentUserId = null

	}

	const brewery = await getBrewery((await params).id)
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">{brewery.name}</h1>
					<ul>
						<li>{brewery.location}</li>
						<li>{brewery.date_of_founding}</li>
						<li>{brewery.author_id}</li>
						<li>{brewery.display_name}</li>
						{brewery.author_id === currentUserId && (
							<li><Link
							href={`/breweries/${brewery.id}/edit`}
							className="text-blue-600 hover:underline font-semibold">Edit</Link></li>
						)}
					</ul>
					<div className="mt-6 flex flex-col space-y-4">
						{brewery.beers.map((beer: Beer) => (
							<Link href={`/beers/${beer.id}`} key={beer.id}>
								<BeerCard entry={beer} key={beer.id} />
							</Link>
						))}
					</div>
				</div>
			</main>
	)	
}