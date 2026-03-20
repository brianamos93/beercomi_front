import Link from "next/link";
import { cookies } from "next/headers";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Suspense } from "react";
import BreweriesLoading from "./components/BreweriesLoading";
import BreweryList from "./components/BreweryList";


export default async function BreweriesPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const page = Number((await searchParams).page) || 1;
	const token = (await cookies()).get("token")?.value;

	return (
		<main>
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4 text-center">
					Breweries
				</h1>

				{/* Instant render */}
				{token && (
					<div className="flex justify-center my-6">
						<Link
							href="/breweries/new"
							className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 text-black font-semibold rounded-lg shadow hover:bg-amber-500 transition"
						>
							<PlusIcon className="w-5 h-5" />
							Add Brewery
						</Link>
					</div>
				)}

				{/* Streaming list */}
				<Suspense fallback={<BreweriesLoading />}>
					<BreweryList page={page} />
				</Suspense>
			</div>
		</main>
	);
}