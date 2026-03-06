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
		const userData = await getLoggedInUsersData(token);
		userId = userData.id;
		const favoriteRes = await checkFavorite(brewery.id, "breweries", token);

		favorited = Boolean(favoriteRes.favorited);
		favorite_id = favoriteRes.favorited ? favoriteRes.favorite_id : undefined;
	}

	return (
		<main>
			<div className="max-w-2xl mx-auto p-4">
				<div>
					<CoverImage cover_image={brewery.cover_image} name={brewery.name} />
				</div>
				<h1 className="text-2xl font-bold mb-4">{brewery.name}</h1>
				<ul>
					<li>{brewery.location}</li>
					<li>{brewery.date_of_founding}</li>
					{brewery.author_id === userId && (
						<li>
							<Link
								href={`/breweries/${brewery.id}/edit`}
								className="text-blue-600 hover:underline font-semibold"
							>
								Edit
							</Link>
						</li>
					)}
					<li>
						{token ? (
							<ToggleFavoriteButton
								type="breweries"
								id={brewery.id}
								initialFavorite={favorited}
								favorite_id={favorite_id}
							/>
						) : null}
					</li>
				</ul>
				<div className="mt-6 flex flex-col space-y-4">
					<h2 className="text-xl font-bold mb-2">Beers</h2>
					{brewery.beers.map((beer: Beer) => (
						<BeerCard type={"nobrewery"} entry={beer} key={beer.id} />
					))}

					<PaginationLinks
						currentPage={formattedPage}
						totalPages={totalPages}
						basePath={`/breweries/${(await params).id}`}
					/>
				</div>
			</div>
		</main>
	);
}
