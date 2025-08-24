import { Brewery } from "@/app/utils/def";
import Link from "next/link";
import Image from 'next/image'


export default function BreweryCard({ entry }: { entry: Brewery}) {
	const coverImage = entry.cover_image
    	? `http://localhost:3005/${entry.cover_image}`
    	: "/file.svg";
	return (
		<>
		<Link
		href={`/breweries/${entry.id}`}
		>
			<div className="border p-4 rounded-lg shadow-md bg-yellow-50">
				<div>
					<Image
					src={coverImage}
					width={200}
					height={200}
					alt={`${entry.name}`}
					/>
				</div>
				<div>
					<h2 className="text-lg font-semibold">{entry.name}</h2>
					<p><strong>Location:</strong> {entry.location}</p>
					<p><strong>Date of Founding:</strong> {entry.date_of_founding}</p>
					<p><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
				</div>
			</div>
	  </Link>
	  </>
	);
  }