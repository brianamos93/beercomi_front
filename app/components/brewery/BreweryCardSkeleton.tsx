import {
	CardBase,
	CardImage,
	CardContent,
	CardTitle,
	CardMeta,
} from "@/app/components/interface/CardLibrary";

export default function BreweryCardSkeleton() {
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

				{/* Meta */}
				<CardMeta>
					<div className="space-y-2">
						<div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
						<div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
					</div>
				</CardMeta>

				{/* Action */}
				<div className="mt-5">
					<div className="h-4 w-28 bg-amber-200 rounded animate-pulse" />
				</div>
			</CardContent>
		</CardBase>
	);
}