import { Beer } from "@/app/utils/def";

export default function BeerCardDetailed({beer}: {beer:Beer}) {
	return (
		<div>
		<h1 className="text-2xl font-bold mb-4">{beer.name}</h1>
			<ul>
				<li>{beer.brewery_name}</li>
				<li>{beer.description}</li>
				<li>{beer.style}</li>
				<li>{beer.ibu}</li>
				<li>{beer.abv}</li>
				<li>{beer.color}</li>
				<li>{beer.author}</li>
			</ul>
	</div>
	)
}