import { getBeer, getBeersList } from "@/app/utils/requests/beerRequests";
import { Beer, Photo, Review } from "@/app/utils/def";
import { cookies } from "next/headers";
import Link from "next/link";
import BeerCardDetailed from "@/app/components/beer/BeerCardDetailed";
import CreateBeerReviewForm from "@/app/components/beer/review/CreateBeerReviewForm";
import { getLoggedInUsersData } from "@/app/utils/requests/userRequests";
import Image from "next/image";
import ToggleFavoriteButton from "@/app/components/interface/buttons/FavoriteToggleClient";
import { checkFavorite } from "@/app/utils/requests/favoriteRequests";
import { PaginationLinks } from "@/app/components/interface/ServerPagination";

export async function generateStaticParams() {
	const beers = await getBeersList();

	return beers.map((beer: Beer) => ({
		slug: beer.id,
	}));
}

export default async function BeerPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ page?: string }>;
}) {
	const token = await (await cookies()).get("token")?.value;
	let userId = null;
	let favorited = false;
	let favorite_id: string | undefined = undefined;

	const searchParamsPage = await searchParams;
	const page = searchParamsPage.page;

	const formattedPage = Number(page) || 1;
	const limit = 10;
	const offset = (formattedPage - 1) * limit;

	const beer = await getBeer((await params).id, limit, offset);

	const totalPages = Math.max(1, Math.ceil(beer.pagination.total / limit));

	if (token) {
		const userData = await getLoggedInUsersData(token);
		userId = userData.id;

		const favoriteRes = await checkFavorite(beer.id, "beers", token);

		favorited = Boolean(favoriteRes.favorited);
		favorite_id = favoriteRes.favorited ? favoriteRes.favorite_id : undefined;
	}
	return (
		<main className="max-w-2xl mx-auto p-4 space-y-8">
			<BeerCardDetailed beer={beer} />

			{beer.author_id === userId && (
				<div>
					<Link
						href={`/beers/${beer.id}/edit`}
						className="inline-block px-4 py-2 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-lg hover:bg-yellow-200"
					>
						Edit Beer
					</Link>
				</div>
			)}

			{token && (
				<div>
					<ToggleFavoriteButton
						type="beers"
						id={beer.id}
						initialFavorite={favorited}
						favorite_id={favorite_id}
					/>
				</div>
			)}

			<section>
				<h2 className="text-2xl font-bold mb-6 border-b pb-2">Reviews</h2>

				{userId !== null &&
					!beer.reviews.some(
						(review: Review) => review.author_id === userId,
					) && (
						<div className="mb-6">
							<CreateBeerReviewForm beer={beer} />
						</div>
					)}

				<div className="space-y-6">
					{beer.reviews.map((review: Review) => (
						<div
							id={review.id}
							key={review.id}
							className="border rounded-xl p-5 bg-white shadow-sm"
						>
							{/* Photos */}
							{review.photos && review.photos.length > 0 && (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
									{review.photos.map((photo: Photo) => (
										<Image
											key={photo.id}
											src={photo.photo_url}
											alt="Review photo"
											width={150}
											height={150}
											className="rounded-lg object-cover w-full h-32"
										/>
									))}
								</div>
							)}

							{/* Review text */}
							<p className="text-gray-800 mb-4 leading-relaxed">
								{review.review}
							</p>

							{/* Metadata */}
							<div className="flex items-center justify-between text-sm">
								<div className="space-x-4">
									<span className="text-yellow-600 font-semibold">
										⭐ {review.rating}
									</span>
									<span className="text-gray-500">by {review.author_name}</span>
								</div>

								{review.author_id === userId && (
									<Link
										href={`/beers/${beer.id}/review/${review.id}/edit`}
										className="text-blue-600 hover:underline font-semibold"
									>
										Edit
									</Link>
								)}
							</div>
						</div>
					))}
				</div>
			</section>

			<PaginationLinks
				currentPage={formattedPage}
				totalPages={totalPages}
				basePath={`/breweries/${(await params).id}`}
			/>
		</main>
	);
}
