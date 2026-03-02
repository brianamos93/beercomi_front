import EditBeerForm from "@/app/components/beer/EditBeerForm";
import { getBeer } from "@/app/utils/requests/beerRequests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: 'Edit Beer',
}

export default async function editBeerPage(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id
	const beer = await getBeer(id);

	if (!beer) {
		notFound()
	}

	return (
		<main>
			<EditBeerForm beer={beer} />
		</main>
	)
}