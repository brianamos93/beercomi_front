import { getBeer, getBeersList } from "@/app/utils/requests/beerRequests";
import { Beer, Review } from "@/app/utils/def";
import { cookies } from "next/headers";
import { decrypt } from "@/app/utils/requests/userRequests";
import Link from "next/link";
import BeerCardDetailed from "@/app/components/beer/BeerCardDetailed";
import CreateBeerReviewForm from "@/app/components/beer/review/CreateBeerReviewForm";

export async function generateStaticParams() {
	const beers = await getBeersList()

	return beers.map((beer: Beer) => ({
		slug: beer.id
	}))
}

export default async function BeerPage({params}:{params: Promise<{ id: string }> 
}) {
	const session = await (await cookies()).get('session')?.value
	let currentUserId = null
	if(session) {
		const decryptedCookie = await decrypt(session)
		currentUserId = decryptedCookie.userID
	} else {
		currentUserId = null

	}
	const beer = await getBeer((await params).id)
	return (
			<main className="max-w-2xl mx-auto p-4">
				<BeerCardDetailed beer={beer} />
				{beer.author === currentUserId && (
							<span><Link
							href={`/beers/${beer.id}/edit`}
							className="text-yellow-600 hover:underline font-semibold">Edit</Link></span>
						)}
					<div>
						<h2 className="text-2xl font-bold mt-6 mb-4">Reviews</h2>
						{currentUserId !== null && (
							<CreateBeerReviewForm beer={beer} />
							)}
						{beer.reviews.map((review: Review) => (
							<div key={review.id} className="border p-4 mb-4">
								<p className="text-gray-700">{review.review}</p>
								<p className="text-yellow-500">Rating: {review.rating}</p>
								<p className="text-gray-500">By: {review.author_name}</p>
								{review.author_id === currentUserId && (
									<span><Link
										href={`/beers/${beer.id}/review/${review.id}/edit`}
										className="text-blue-600 hover:underline font-semibold">Edit</Link></span>
								)}
							</div>))}
					</div>
			</main>

	)	
}