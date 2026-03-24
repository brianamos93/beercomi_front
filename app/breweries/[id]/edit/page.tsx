import EditBreweryForm from "@/app/components/brewery/EditBreweryForm";
import { Brewery } from "@/app/utils/def";
import { getBrewery } from "@/app/utils/requests/breweryRequests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: Brewery;
}): Promise<Metadata> {
	const { id } = await params;
	const brewery = await getBrewery(id);

	return {
		title: `${brewery.name}の情報を編集`,
		description: `${brewery.name}の住所、設立年などを簡単に修正可能。`,
	};
}

export default async function editBreweryPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const id = params.id;
	const brewery = await getBrewery(id);

	if (!brewery) {
		notFound();
	}

	return (
		<main>
			<EditBreweryForm brewery={brewery} />
		</main>
	);
}
