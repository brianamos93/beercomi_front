import EditBeerForm from "@/app/components/beer/EditBeerForm";
import { Beer } from "@/app/utils/def";
import { getBeer } from "@/app/utils/requests/beerRequests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: Beer;
}): Promise<Metadata> {
	const { id } = await params;
	const beer = await getBeer(id);

	return {
		title: `${beer.name}の情報を編集`,
		description: `${beer.name}の味わいや特徴、スタイル、カラーなどを簡単に修正可能。`,
	};
}

export default async function editBeerPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const id = params.id;
	const beer = await getBeer(id);

	if (!beer) {
		notFound();
	}

	return (
		<main>
			<EditBeerForm beer={beer} />
		</main>
	);
}
