import Link from "next/link";
import BreweryCard from "../components/brewery/BreweryCard";
import { getBreweries } from "../utils/requests/breweryRequests";
import { Brewery } from "../utils/def";

export default async function brewerys() {
	const data = await getBreweries()
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">Breweries</h1>
					<ul className="space-y-4">
					{data.map((brewery: Brewery) => (
						<li key={brewery.id}>
							<Link href={`/breweries/${brewery.id}`}>
							<BreweryCard entry={brewery} />
							</Link>
						</li>
					))}
					</ul>
				</div>
			</main>
	)
}