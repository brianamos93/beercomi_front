import EditBeerForm from "@/app/components/EditBeerForm";
import { getBeer } from "@/app/utils/requests/beerRequests";
import { getBreweries } from "@/app/utils/requests/breweryRequests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: 'Edit Beer',
}

export default async function editBeerPage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id
	const [beer, breweries] = await Promise.all([
		getBeer(id),
		getBreweries(),
	])

	if (!beer) {
		notFound()
	}

	return (
		<main>
			<EditBeerForm beer={beer} breweries={breweries} />
		</main>
	)
}