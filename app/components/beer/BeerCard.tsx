import { Beer } from "@/app/utils/def";
import Link from "next/link";

export default function BeerCard({ entry }: { entry: Beer }) {
	return (
		<Link
		href={`/beers/${entry.id}`}
		>
	  		<div className="border p-4 rounded-lg shadow-md bg-yellow-50">
				<h2 className="text-lg font-semibold">{entry.name} 🍺</h2>
				<p><strong>Style:</strong> {entry.style}</p>
				<p><strong>ABV:</strong> {entry.abv}%</p>
				<p><strong>Brewery:</strong> {entry.brewery_name}</p>
				<p><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
	  		</div>
	  </Link>
	);
  }