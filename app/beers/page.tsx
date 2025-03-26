import Link from "next/link";
import BeerCard from "../components/BeerCard";
import { getBeers } from "../utils/beerRequests";
import { Beer } from "../utils/def";

export default async function beers() {
	const data = await getBeers()
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">Beers</h1>
					<h2>New Beer</h2>
					<ul className="space-y-4">
					{data.map((beer: Beer) => (
						<li key={beer.id}>
							<Link href={`/beers/${beer.id}`}>
							<BeerCard entry={beer} />
							</Link>
						</li>
					))}
					</ul>
				</div>
			</main>
	)
}