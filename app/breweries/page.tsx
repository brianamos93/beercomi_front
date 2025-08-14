import Link from "next/link";
import BreweryCard from "../components/brewery/BreweryCard";
import { getBreweries } from "../utils/requests/breweryRequests";
import { Brewery } from "../utils/def";
import { cookies } from "next/headers";

export default async function brewerys() {
	const data = await getBreweries()

	const token = await (await cookies()).get('token')?.value

	
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">Breweries</h1>
					{token !== null && (
							<Link href="/breweries/new"><h2>New Brewery</h2></Link>
						)}
					<ul className="space-y-4">
					{data.map((brewery: Brewery) => (
						<li key={brewery.id}>
							<BreweryCard entry={brewery} />
						</li>
					))}
					</ul>
				</div>
			</main>
	)
}