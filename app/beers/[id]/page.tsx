import {
	getBeer,
	getBeersList,
} from "@/app/utils/requests/beerRequests";
import { Beer, Photo, Review } from "@/app/utils/def";
import { cookies } from "next/headers";
import Link from "next/link";
import BeerCardDetailed from "@/app/components/beer/BeerCardDetailed";
import CreateBeerReviewForm from "@/app/components/beer/review/CreateBeerReviewForm";
import { getLoggedInUsersData } from "@/app/utils/requests/userRequests";
import url from "@/app/utils/utils";
import Image from "next/image";
import ToggleFavoriteButton from "@/app/components/interface/buttons/FavoriteToggleClient";
import { checkFavorite } from "@/app/utils/requests/favoriteRequests";

export async function generateStaticParams() {
	const beers = await getBeersList();

	return beers.map((beer: Beer) => ({
		slug: beer.id,
	}));
}

export default async function BeerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const token = await (await cookies()).get("token")?.value;
	let userId = null;
	let favorited = false;
	let favorite_id: string | undefined = undefined;
	const beer = await getBeer((await params).id);

	if (token) {
		const userData = await getLoggedInUsersData(token);
		userId = userData.id;

		const favoriteRes = await checkFavorite(beer.id, "beers", token);

		favorited = Boolean(favoriteRes.favorited);
		favorite_id = favoriteRes.favorited ? favoriteRes.favorite_id : undefined;
	}
	return (
		<main className="max-w-2xl mx-auto p-4">
			<BeerCardDetailed beer={beer} />
			{beer.author_id === userId && (
				<span>
					<Link
						href={`/beers/${beer.id}/edit`}
						className="text-yellow-600 hover:underline font-semibold"
					>
						Edit
					</Link>
				</span>
			)}
			<div>
				{token ? (
					<ToggleFavoriteButton
						type="beers"
						id={beer.id}
						initialFavorite={favorited}
						favorite_id={favorite_id}
					/>
				) : (
					null
				)}

				<h2 className="text-2xl font-bold mt-6 mb-4">Reviews</h2>
				{userId !== null &&
					!beer.reviews.some(
						(review: Review) => review.author_id === userId
					) && <CreateBeerReviewForm beer={beer} />}
				{beer.reviews.map((review: Review) => (
					<div id={review.id} key={review.id} className="border p-4 mb-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{review.photos ? (
								review.photos.map((photo: Photo) => (
									<div key={photo.id}>
										<Image
											src={`${url}${photo.photo_url}`}
											alt="uploaded"
											width={150}
											height={150}
											className="h-auto max-w-full rounded-lg"
										/>
									</div>
								))
							) : (
								<div></div>
							)}
						</div>
						<p className="text-gray-700">{review.review}</p>
						<p className="text-yellow-500">Rating: {review.rating}</p>
						<p className="text-gray-500">By: {review.author_name}</p>
						{review.author_id === userId && (
							<span>
								<Link
									href={`/beers/${beer.id}/review/${review.id}/edit`}
									className="text-blue-600 hover:underline font-semibold"
								>
									Edit
								</Link>
							</span>
						)}
					</div>
				))}
			</div>
		</main>
	);
}
