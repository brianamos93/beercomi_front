import { Beer } from "@/app/utils/def";

export default function BeerCardDetailed({beer}: {beer:Beer}) {
	return (
		<div>
		<h1 className="text-2xl font-bold mb-4">{beer.name}</h1>
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