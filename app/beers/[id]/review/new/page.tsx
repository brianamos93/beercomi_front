import CreateBeerReviewForm from "@/app/components/beer/review/CreateBeerReviewForm"
import { getBeer } from "@/app/utils/requests/beerRequests"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
	title: 'New Beer Review',
}

export default async function beerReview(props: { params: Promise<{ id: string }>}) {
	const params = await props.params
	const id = params.id
	const [beer] = await Promise.all([
		getBeer(id)
		])

	if(!beer) {
		notFound()
	}

	return (
		<main>
			<CreateBeerReviewForm beer={beer} />
		</main>
	)
}