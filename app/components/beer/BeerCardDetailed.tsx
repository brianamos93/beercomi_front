import { Beer } from "@/app/utils/def";
import Image from "next/image";
import { NewspaperIcon } from "@heroicons/react/24/outline";

export default function BeerCardDetailed({ beer }: { beer: Beer }) {
	return (
		<div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
			<div className="flex flex-col md:flex-row gap-6">
				{/* Image */}
				<div className="flex-shrink-0 flex justify-center">
					{beer.cover_image ? (
						<Image
							src={beer.cover_image}
							alt={beer.name}
							width={200}
							height={200}
							className="rounded-xl object-cover"
						/>
					) : (
						<div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-xl">
							<NewspaperIcon className="w-20 h-20 text-gray-400" />
						</div>
					)}
				</div>

				{/* Content */}
				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">{beer.name}</h1>

					<p className="text-sm text-gray-500 mb-4">
						Brewed by{" "}
						<span className="font-medium text-gray-700">
							{beer.brewery_name}
						</span>
					</p>

					<p className="text-gray-700 mb-4">{beer.description}</p>

					{/* Beer stats */}
					<div className="grid grid-cols-2 gap-3 text-sm">
						<div className="bg-gray-50 rounded-lg px-3 py-2">
							<span className="text-gray-500">Style</span>
							<p className="font-semibold text-gray-800">{beer.style}</p>
						</div>

						<div className="bg-gray-50 rounded-lg px-3 py-2">
							<span className="text-gray-500">IBU</span>
							<p className="font-semibold text-gray-800">{beer.ibu}</p>
						</div>

						<div className="bg-gray-50 rounded-lg px-3 py-2">
							<span className="text-gray-500">ABV</span>
							<p className="font-semibold text-gray-800">
								{beer.abv.toFixed(1)}%
							</p>
						</div>

						<div className="bg-gray-50 rounded-lg px-3 py-2">
							<span className="text-gray-500">Color</span>
							<p className="font-semibold text-gray-800">{beer.color}</p>
						</div>
					</div>

					<p className="text-xs text-gray-400 mt-4">
						Added by {beer.author_name}
					</p>
				</div>
			</div>
		</div>
	);
}
