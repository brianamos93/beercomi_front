import { Brewery } from "@/app/utils/def";
import Link from "next/link";
import CoverImage from "../interface/coverImage";
import { ArrowRightIcon } from "@heroicons/react/20/solid"


export default function BreweryCard({ entry }: { entry: Brewery}) {
	return (
			<div className="md:max-w-lg max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
				<div className="flex justify-center items-center flex-col m-5">
					<Link href={`/breweries/${entry.id}`}>
					<CoverImage cover_image={entry.cover_image} name={entry.name} />
					</Link>
				</div>
				<div className="p-5">
					<Link href={`/breweries/${entry.id}`}>
						<h2 className="break-words mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{entry.name}</h2>
					</Link>
					<p className="mb-1 font-normal text-gray-700 dark:text-gray-400"><strong>Location:</strong> {entry.location}</p>
					<p className="mb-1 font-normal text-gray-700 dark:text-gray-400"><strong>Date of Founding:</strong> {entry.date_of_founding}</p>
					<p className="mb-1 font-normal text-gray-700 dark:text-gray-400"><strong>Updated:</strong> {new Date(entry.date_updated).toLocaleString()}</p>
					<Link href={`/breweries/${entry.id}`} className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            			Read more
						<ArrowRightIcon className="h-5 w-5"/>
        			</Link>
				</div>
			</div>
	);
  }