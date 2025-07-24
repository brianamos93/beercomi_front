import EditBeerReviewForm from "@/app/components/beer/review/EditBeerReviewForm";
import { getBeer } from "@/app/utils/requests/beerRequests";
import { getReview } from "@/app/utils/requests/reviewRequests";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: 'Edit Beer Review',
}

export default async function editBeerReview(props: { params: Promise<{ id: string, slug: string }>}) {
	const params = await props.params;
	const id = params.id;
	const slug = params.slug;

	const [beer, review] = await Promise.all([
		getBeer(id),
		getReview(slug)
	]);

	if (!beer || !review) {
		notFound();
	}
		if (beer.id !== review.beer_id) {
		notFound();
	}
	return (
		<main>
			<EditBeerReviewForm beer={beer} review={review} />
		</main>
	);
}