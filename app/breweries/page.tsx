import Link from "next/link";
import BreweryCard from "../components/brewery/BreweryCard";
import { getBreweries } from "../utils/requests/breweryRequests";
import { Brewery } from "../utils/def";
import { cookies } from "next/headers";
import { decrypt, getSession } from "../utils/requests/userRequests";

export default async function brewerys() {
	const data = await getBreweries()

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
					<h1 className="text-2xl font-bold mb-4">Breweries</h1>
					{loggedIn === true && (
							<Link href="/breweries/new"><h2>New Brewery</h2></Link>
						)}
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