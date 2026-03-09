import Link from "next/link";
import BreweryCard from "../components/brewery/BreweryCard";
import { getBreweries } from "../utils/requests/breweryRequests";
import { Brewery } from "../utils/def";
import { cookies } from "next/headers";
import { PaginationLinks } from "../components/interface/ServerPagination";
import { PlusIcon } from "@heroicons/react/24/solid";

export default async function BreweriesPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;
	const page = params.page;

	const formattedPage = Number(page) || 1;
	const limit = 10;
	const offset = (formattedPage - 1) * limit;

	// Call API with pagination
	const { data, pagination } = await getBreweries({
		offset: offset,
		limit,
	});

	const token = await (await cookies()).get("token")?.value;
	const totalPages = Math.ceil(pagination.total / limit);

	return (
		<main>
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4 text-center">Breweries</h1>

				{token && (
					<div className="flex justify-center my-6">
						<Link href="/breweries/new"
						className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 text-black font-semibold rounded-lg shadow hover:bg-amber-500 transition">
							<PlusIcon className="w-5 h-5" />
							Add Brewery
						</Link>
					</div>
				)}

				<ul className="space-y-4 flex flex-col items-center">
					{data.map((brewery: Brewery) => (
						<li key={brewery.id} className="w-full max-w-md">
							<BreweryCard entry={brewery} />
						</li>
					))}
				</ul>

				<div className="max-w-md mx-auto mt-6">
					<PaginationLinks
						currentPage={formattedPage}
						totalPages={totalPages}
						basePath={`/breweries`}
					/>
				</div>
			</div>
		</main>
	);
}
