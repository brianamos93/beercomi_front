import { getBrewery, getBreweriesList } from "@/app/utils/requests/breweryRequests";
import { Brewery } from "@/app/utils/def";

export async function generateStaticParams() {
	const breweries = await getBreweriesList()

	return breweries.map((brewery: Brewery) => ({
		slug: brewery.id
	}))
}

export default async function BreweryPage({params}:{params: Promise<{ id: string }> 
}) {
	const brewery = await getBrewery((await params).id)
	return (
			<main>
				<div className="max-w-2xl mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">{brewery.name}</h1>
					<ul>
						<li>{brewery.location}</li>
						<li>{brewery.date_of_founding}</li>
						<li>{brewery.authorid}</li>
						<li>{brewery.display_name}</li>
					</ul>
				</div>
			</main>
	)	
}