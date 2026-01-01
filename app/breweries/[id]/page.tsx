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

export async function generateStaticParams() {
	const breweries = await getBreweriesList();

	return breweries.map((brewery: Brewery) => ({
		slug: brewery.id,
	}));
}

export default async function BreweryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const token = await (await cookies()).get("token")?.value;
	let userId = null;
	let favorited = false;
	let favorite_id: string | undefined = undefined;
	const brewery = await getBrewery((await params).id);

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
					<CoverImage
						cover_image={brewery.cover_image}
						name={brewery.cover_image}
					/>
				</div>
				<h1 className="text-2xl font-bold mb-4">{brewery.name}</h1>
				<ul>
					<li>{brewery.location}</li>
					<li>{brewery.date_of_founding}</li>
					<li>{brewery.author_id}</li>
					<li>{brewery.display_name}</li>
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
						<BeerCard entry={beer} key={beer.id} />
					))}
				</div>
			</div>
		</main>
	);
}
