import { Beer } from "@/app/utils/def";
import Image from "next/image";
import { NewspaperIcon } from "@heroicons/react/24/outline";


export default function BeerCardDetailed({beer}: {beer:Beer}) {
	return (
		<div>
		<h1 className="text-2xl font-bold mb-4">{beer.name}</h1>
		{beer.cover_image ? (
			<Image src={beer.cover_image} alt={beer.name} width={200} height={200} />): (
				<NewspaperIcon className="w-48 h-48 text-gray-500"/>
		)}
			<ul>
				<li>{beer.brewery_name}</li>
				<li>{beer.description}</li>
				<li>Style: {beer.style}</li>
				<li>IBU: {beer.ibu}</li>
				<li>ABV: {beer.abv}%</li>
				<li>Color: {beer.color}</li>
				<li>By: {beer.author_name}</li>
			</ul>
	</div>
	)
}