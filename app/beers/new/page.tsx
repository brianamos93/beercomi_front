import CreateBeerForm from "@/app/components/CreateBeerForm";
import { getBreweries } from "@/app/utils/requests/breweryRequests";


export default async function newBeer() {
	const breweries = await getBreweries()
	return <CreateBeerForm breweries={breweries}/>
}