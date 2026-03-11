export const dynamic = "force-dynamic";
import {
	getBrewery,
	getBreweriesList,
} from "@/app/utils/requests/breweryRequests";
import { Beer, Brewery } from "@/app/utils/def";
import Link from "next/link";
import { cookies } from "next/headers";
import BeerCard from "@/app/components/beer/BeerCard";
import { getLoggedInUsersData } from "@/app/utils/requests/userRequests";
import CoverImage from "@/app/components/interface/coverImage";
import ToggleFavoriteButton from "@/app/components/interface/buttons/FavoriteToggleClient";
import { checkFavorite } from "@/app/utils/requests/favoriteRequests";
import { PaginationLinks } from "@/app/components/interface/ServerPagination";

export async function generateStaticParams() {
	const breweries = await getBreweriesList();

	return breweries.map((brewery: Brewery) => ({
		slug: brewery.id,
	}));
}
export default async function BreweryPage({
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
	const brewery = await getBrewery((await params).id, limit, offset);

	const totalPages = Math.max(1, Math.ceil(brewery.pagination.total / limit));

	if (token) {
		const userData = await getLoggedInUsersData();
		userId = userData.id;
		const favoriteRes = await checkFavorite(brewery.id, "breweries", token);

		favorited = Boolean(favoriteRes.favorited);
		favorite_id = favoriteRes.favorited ? favoriteRes.favorite_id : undefined;
	}

	return (
		<main className="min-h-screen py-8">
			<div className="max-w-3xl mx-auto px-4 space-y-6">
				{/* Brewery Card */}
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
					<div className="flex flex-col md:flex-row gap-6">
						{/* Cover Image */}
						<div className="flex-shrink-0 w-40 h-40 relative">
							<CoverImage
								cover_image={brewery.cover_image}
								name={brewery.name}
							/>
						</div>

						{/* Brewery Info */}
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								{brewery.name}
							</h1>

							<div className="grid grid-cols-2 gap-3 text-sm mb-4">
								<div className="bg-gray-50 rounded-lg px-3 py-2">
									<span className="text-gray-500">Location</span>
									<p className="font-semibold text-gray-800">
										{brewery.location}
									</p>
								</div>

								<div className="bg-gray-50 rounded-lg px-3 py-2">
									<span className="text-gray-500">Founded</span>
									<p className="font-semibold text-gray-800">
										{brewery.date_of_founding}
									</p>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center gap-4 mt-2">
								{brewery.author_id === userId && (
									<Link
										href={`/breweries/${brewery.id}/edit`}
										className="text-sm font-semibold text-yellow-600 hover:underline"
									>
										Edit Brewery
									</Link>
								)}

								{token && (
									<ToggleFavoriteButton
										type="breweries"
										id={brewery.id}
										initialFavorite={favorited}
										favorite_id={favorite_id}
									/>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Beer List */}
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
					<h2 className="text-xl font-bold text-gray-900 mb-4">Beers</h2>

					<div className="flex flex-col items-center gap-4">
						{brewery.beers.length > 0 ? (
						brewery.beers.map((beer: Beer) => (
							<div key={beer.id} className="w-full max-w-lg">
								<BeerCard type="nobrewery" entry={beer} />
							</div>
						))
					) : (
						<p className="text-gray-500 text-center">No beers yet.</p>
					)}
					</div>

					{/* Pagination */}
					<div className="mt-6 flex justify-center">
						<PaginationLinks
							currentPage={formattedPage}
							totalPages={totalPages}
							basePath={`/breweries/${(await params).id}`}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
