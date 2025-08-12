import Link from "next/link";
import BeerCard from "../components/beer/BeerCard";
import { getBeers } from "../utils/requests/beerRequests";
import { Beer } from "../utils/def";
import { cookies } from "next/headers";

export default async function beers() {
	const data = await getBeers()

	const token = await (await cookies()).get('token')?.value

	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">Beers</h1>
					{token !== undefined && (
							<Link href="/beers/new"><h2>New Beer</h2></Link>
						)}
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