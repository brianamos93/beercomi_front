import { Beer } from "@/app/utils/def";
import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/20/solid";

export default function BeerHeader({ beer }: { beer: Beer }) {
	const coverImage = beer.cover_image ? beer.cover_image : "/file.svg";
	return (
		<div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
			<div className="flex flex-col sm:flex-row gap-6">
				{/* Beer Label */}
				<div className="flex-shrink-0 flex justify-center sm:block">
					<Image
						src={coverImage}
						alt={beer.name}
						width={240}
						height={240}
						className="w-36 h-36 md:w-48 md:h-48 rounded-xl object-cover"
					/>
				</div>

				{/* Beer Info */}
				<div className="flex-1 min-w-0 text-center sm:text-left">
					{/* Name */}
					<h1 className="text-3xl font-bold text-gray-900">{beer.name}</h1>
					{/* Brewery */}
					<Link
						href={`/breweries/${beer.brewery_id}`}
						className="text-gray-600 hover:text-amber-600"
					>
						{beer.brewery_name}
					</Link>
					{/* Rating */}
					<div className="flex items-center gap-2 mt-2">
						<div className="flex">
							{[1, 2, 3, 4, 5].map((star) => (
								<StarIcon
									key={star}
									className={`w-5 h-5 ${
										star <= Math.round(beer.avg_rating)
											? "text-yellow-400"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>

						<span className="text-sm text-gray-600">{beer.avg_rating}</span>
						<span className="text-sm text-gray-600">
							{beer.review_count} レビュー
						</span>
					</div>
					{/* Stats Row */}
					<div className="flex flex-wrap gap-4 text-sm mt-3 text-gray-700 ">
						<span className="bg-gray-100 px-3 py-1 rounded-full">
							{beer.style}
						</span>

						<span className="bg-gray-100 px-3 py-1 rounded-full">
							ABV {beer.abv?.toFixed(1)}%
						</span>

						{beer.ibu && (
							<span className="bg-gray-100 px-3 py-1 rounded-full">
								IBU {beer.ibu}
							</span>
						)}

						{beer.color && (
							<span className="bg-gray-100 px-3 py-1 rounded-full">
								色: {beer.color}
							</span>
						)}
					</div>
					{/* Description */}
					<p className="mt-4 text-gray-700 leading-relaxed">
						{beer.description}
					</p>
				</div>
			</div>
		</div>
	);
}
