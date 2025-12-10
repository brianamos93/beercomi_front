import {
	getBrewery,
	getBreweriesList,
	favoriteBreweries,
} from "@/app/utils/requests/breweryRequests";
import { Beer, Brewery } from "@/app/utils/def";
import Link from "next/link";
import { cookies } from "next/headers";
import BeerCard from "@/app/components/beer/BeerCard";
import { getLoggedInUsersData } from "@/app/utils/requests/userRequests";
import Image from "next/image";
import CoverImage from "@/app/components/interface/coverImage";
import ToggleFavoriteButton from "@/app/components/interface/buttons/FavoriteToggleClient";

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
	const brewery = await getBrewery((await params).id);

	if (token) {
		const userData = await getLoggedInUsersData(token);
		userId = userData.id;
		const favorites = await favoriteBreweries(token);
		if (favorites) {
			brewery.favorited = favorites.some((fav) => fav.beer_id === brewery.id);
			const favorite_detail = favorites.find(
				(fav) => fav.brewery_id === brewery.id
			);
			brewery.favorite_detail = favorite_detail || null;
		} else {
			brewery.favorited = false;
			brewery.favoriteDetail = null;
		}
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
						<ToggleFavoriteButton
							type="beers"
							id={brewery.id}
							initialFavorite={brewery.favorited}
							object={brewery}
						/>
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
