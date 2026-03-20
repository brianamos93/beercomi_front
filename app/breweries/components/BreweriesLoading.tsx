import BreweryCardSkeleton from "@/app/components/brewery/BreweryCardSkeleton";

export default function BreweriesLoading() {
	return (
		<>
			{/* Button skeleton */}
			<div className="flex justify-center my-6">
				<div className="h-12 w-44 bg-amber-200 rounded-lg animate-pulse" />
			</div>

			{/* Brewery list skeleton */}
			<ul className="space-y-4 flex flex-col items-center">
				{Array.from({ length: 5 }).map((_, i) => (
					<li key={i} className="w-full max-w-md">
						<BreweryCardSkeleton />
					</li>
				))}
			</ul>

			{/* Pagination skeleton */}
			<div className="max-w-md mx-auto mt-6 flex justify-center gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="h-8 w-10 bg-gray-300 rounded animate-pulse"
					/>
				))}
			</div>
		</>
	);
}