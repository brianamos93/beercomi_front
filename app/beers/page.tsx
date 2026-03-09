import Link from "next/link";
import BeerCard from "../components/beer/BeerCard";
import { getBeers } from "../utils/requests/beerRequests";
import { Beer } from "../utils/def";
import { cookies } from "next/headers";
import { PaginationLinks } from "../components/interface/ServerPagination";
import { PlusIcon } from "@heroicons/react/24/solid";

export default async function beers({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;

	const page = Number(params.page) || 1;
	const limit = 10;
	const offset = (page - 1) * limit;

	const { data, pagination } = await getBeers({ offset, limit });

	const token = (await cookies()).get("token")?.value;
	const totalPages = Math.ceil(pagination.total / limit);

	return (
		<main>
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4 text-center">Beers</h1>

				{token && (
					<div className="flex justify-center my-6">
						<Link
							href="/beers/new"
							className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 text-black font-semibold rounded-lg shadow hover:bg-amber-500 transition"
						>
							<PlusIcon className="w-5 h-5" />
							New Beer
						</Link>
					</div>
				)}

				<ul className="space-y-4 flex flex-col items-center">
					{data.map((beer: Beer) => (
						<li key={beer.id} className="w-full max-w-md">
							<BeerCard entry={beer} />
						</li>
					))}
				</ul>

				<div className="max-w-md mx-auto mt-6">
					<PaginationLinks
						currentPage={page}
						totalPages={totalPages}
						basePath="/beers"
					/>
				</div>
			</div>
		</main>
	);
}
