import { Brewery } from "@/app/utils/def";
import Link from "next/link";
import CoverImage from "../interface/coverImage";

import {
	CardBase,
	CardImage,
	CardContent,
	CardTitle,
	CardMeta,
	CardAction,
} from "@/app/components/interface/CardLibrary";

export default function BreweryCard({ entry }: { entry: Brewery }) {
	return (
		<CardBase>
			<Link href={`/breweries/${entry.id}`}>
				<CardImage>
					<CoverImage cover_image={entry.cover_image} name={entry.name} />
				</CardImage>
			</Link>

			<CardContent>
				<Link href={`/breweries/${entry.id}`}>
					<CardTitle>{entry.name}</CardTitle>
				</Link>

				<CardMeta>
					<p>
						<strong>Location:</strong> {entry.location}
					</p>
					<p>
						<strong>Founded:</strong> {entry.date_of_founding}
					</p>
					<p>
						<strong>Updated:</strong> {new Date(entry.date_updated).toLocaleDateString()}
					</p>
				</CardMeta>

				<CardAction link={`/breweries/${entry.id}`} type={"brewery"} />
			</CardContent>
		</CardBase>
	);
}
