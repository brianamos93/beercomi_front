import { Review } from "@/app/utils/def";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
	Card,
	CardAction,
	CardContent,
	CardImage,
	CardMeta,
	CardTitle,
} from "../../interface/cards";
import CoverImage from "../../interface/coverImage";
import { StarIcon } from "@heroicons/react/20/solid";

function hashStringToNumber(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0; // convert to 32bit integer
	}
	return Math.abs(hash);
}

export default function ReviewCard({ entry }: { entry: Review }) {
	const photoUrl = entry.photos?.length
		? entry.photos[hashStringToNumber(entry.id) % entry.photos.length]
				?.photo_url
		: undefined;
	return (
		<Card>
			<Link href={`/beers/${entry.beer_id}#${entry.id}`}>
				<CardImage>
					<CoverImage
						cover_image={photoUrl}
						name={`${entry.beer_name} photo`}
					/>
				</CardImage>
			</Link>

			<CardContent>
				<Link href={`/beers/${entry.beer_id}#${entry.id}`}>
					<CardTitle>{`${entry.beer_name} Review`}</CardTitle>
				</Link>

				<CardMeta>
					<p>
						<strong>Brewery:</strong> {entry.brewery_name}
					</p>
					<div className="flex items-center gap-2">
						<strong>Rating:</strong>
						{[1, 2, 3, 4, 5].map((star) => (
							<StarIcon
								key={star}
								className={`h-4 w-4 ${
									star <= Math.round(entry.rating)
										? "text-yellow-400"
										: "text-gray-300"
								}`}
							/>
						))}
					</div>

					<p>
						<strong>Updated:</strong> {new Date(entry.date_updated).toLocaleDateString()}
					</p>
				</CardMeta>
				<CardAction
					link={`/beers/${entry.beer_id}#${entry.id}`}
					type={"review"}
				/>
			</CardContent>
		</Card>
	);
}
