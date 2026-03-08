import { Beer } from "@/app/utils/def";
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

type BeerCardType = "brewery" | "nobrewery";

export default function BeerCard({
	entry,
	type = "brewery",
}: {
	entry: Beer;
	type?: BeerCardType;
}) {
	const fixedAbv = Number(entry.abv).toFixed(1);
	return (
		<CardBase>
			<Link href={`/beers/${entry.id}`}>
				<CardImage>
					<CoverImage cover_image={entry.cover_image} name={entry.name} />
				</CardImage>
			</Link>

			<CardContent>
				<Link href={`/beers/${entry.id}`}>
					<CardTitle>{entry.name}</CardTitle>
				</Link>

				<CardMeta>
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

				<CardAction link={`/beers/${entry.id}`} type={"beer"} />
			</CardContent>
		</CardBase>
	);
}
