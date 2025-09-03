import { Review } from "@/app/utils/def";
import Link from "next/link";
import Image from 'next/image'
import { ArrowRightIcon } from "@heroicons/react/20/solid"
import { NewspaperIcon } from "@heroicons/react/24/outline";


export default function ReviewCard({ entry }: { entry: Review}) {
	const firstPhoto = entry.photos?.[0]
	return (
		<>
			<div className="md:max-w-lg max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
				<div className="flex flex-col items-center justify-center mx-5 mb-5">{
					firstPhoto ? (
						<>
							<Link
								href={`/beers/${entry.beer_id}#${entry.id}`}
							>
								<Image
								src={`http://localhost:3005${firstPhoto.photo_url}`}
								width={200}
								height={200}
								alt={`${entry.beer_name} photo`}
								className="object-cover rounded-lg mb-2"
								/>
							</Link>
						</>
					
						): (
							<Link
								href={`/beers/${entry.beer_id}#${entry.id}`}
							>
								<NewspaperIcon className="w-48 h-48 text-gray-500"/>
							</Link>	
						)}
					<h2 className="text-lg font-semibold">
						{entry.brewery_name}&apos;s {entry.beer_name} Review
					</h2>
					<div>
						<p><strong>Author:</strong> {entry.author_name}</p>
						<p><strong>Rating:</strong> {entry.rating}</p>
						<p><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
						<Link
							href={`/beers/${entry.beer_id}#${entry.id}`}
							className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Read More
							<ArrowRightIcon className="h-5 w-5"/>
						</Link>
					</div>
				</div>
			</div>
			
		</>
	);
  }