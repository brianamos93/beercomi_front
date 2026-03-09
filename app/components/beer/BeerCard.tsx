import { Beer } from "@/app/utils/def";
import Link from "next/link";
import CoverImage from "../interface/coverImage";
import { StarIcon } from "@heroicons/react/20/solid";

import {
	CardBase,
	CardImage,
	CardContent,
	CardTitle,
	CardMeta,
	CardAction,
} from "@/app/components/interface/CardLibrary";

type BeerCardType = "brewery" | "nobrewery";

export default function BeerCard({
	entry,
	type = "brewery",
}: {
	entry: Beer;
	type?: BeerCardType;
}) {
	const beerUrl = `/beers/${entry.id}`;
	const fixedAbv = Number(entry.abv).toFixed(1);
	const rating = Math.round(entry.avg_rating);

	return (
		<CardBase>
			<Link href={beerUrl}>
				<CardImage>
					<CoverImage cover_image={entry.cover_image} name={entry.name} />
				</CardImage>
			</Link>

			<CardContent>
				<Link href={beerUrl}>
					<CardTitle>{entry.name}</CardTitle>
				</Link>

				<CardMeta>
					{/* Rating */}
					<div className="flex items-center gap-2 mt-2">
						<div className="flex">
							{[1, 2, 3, 4, 5].map((star) => (
								<StarIcon
									key={star}
									className={`w-5 h-5 ${
										star <= rating ? "text-yellow-400" : "text-gray-300"
									}`}
								/>
							))}
						</div>
					</div>
					<p>
						<strong>Style:</strong> {entry.style}
					</p>

					<p>
						<strong>ABV:</strong> {fixedAbv}%
					</p>

					<p>
						<strong>IBU:</strong> {entry.ibu}
					</p>
					<p>
						<strong>Updated:</strong>{" "}
						{new Date(entry.date_updated).toLocaleDateString()}
					</p>
				</CardMeta>

				<CardAction link={beerUrl} type="beer" />
			</CardContent>
		</CardBase>
	);
}
