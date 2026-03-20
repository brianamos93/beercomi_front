import {
	CardBase,
	CardImage,
	CardContent,
	CardTitle,
	CardMeta,
} from "@/app/components/interface/CardLibrary";

export default function BeerCardSkeleton() {
	return (
		<CardBase>
			{/* Image */}
			<CardImage>
				<div className="w-full h-full bg-gray-200 animate-pulse" />
			</CardImage>

			<CardContent>
				{/* Title */}
				<CardTitle>
					<div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse" />
				</CardTitle>

				<CardMeta>
					{/* Stars */}
					<div className="flex gap-1 mt-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="w-5 h-5 bg-gray-300 rounded animate-pulse"
							/>
						))}
					</div>

					{/* Meta lines */}
					<div className="space-y-2 mt-2">
						<div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
					</div>
				</CardMeta>

				{/* Action */}
				<div className="mt-5">
					<div className="h-4 w-24 bg-amber-200 rounded animate-pulse" />
				</div>
			</CardContent>
		</CardBase>
	);
}