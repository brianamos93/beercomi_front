import Link from "next/link";
import BeerCard from "../components/BeerCard";
import { getBeers } from "../utils/requests/beerRequests";
import { Beer } from "../utils/def";
import { decrypt, getSession } from "../utils/requests/userRequests";
import { cookies } from "next/headers";

export default async function beers() {
	const data = await getBeers()

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
					<h1 className="text-2xl font-bold mb-4">Beers</h1>
					{loggedIn === true && (
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