import EditBreweryForm from "@/app/components/brewery/EditBreweryForm";
import { getBrewery } from "@/app/utils/requests/breweryRequests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: 'Edit Brewery'
}

export default async function editBreweryPage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id
	const brewery = await getBrewery(id)

	if (!brewery) {
		notFound()
	}

	return (
		<main>
			<EditBreweryForm brewery={brewery} />
		</main>
	)
}