import Link from "next/link";
import BeerCard from "../components/beer/BeerCard";
import { getBeers } from "../utils/requests/beerRequests";
import { Beer } from "../utils/def";
import { cookies } from "next/headers";

export default async function beers({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;
	const page = params.page; 

	const formattedPage = Number(page) || 1;
	const limit = 10;

	const { data, pagination } = await getBeers({ page: formattedPage, limit });

	const token = await (await cookies()).get("token")?.value;
	const totalPages = Math.ceil(pagination.total / limit);

	return (
		<main>
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">Beers</h1>

				{token && (
					<Link href="/beers/new">
						<h2>New Beer</h2>
					</Link>
				)}

				<ul className="space-y-4">
					{data.map((beer: Beer) => (
						<li key={beer.id}>
							<BeerCard entry={beer} />
						</li>
					))}
				</ul>

				<div className="flex justify-between mt-6">
					<Link
						href={`/beers?page=${formattedPage - 1}`}
						className={`px-3 py-2 border rounded ${
							formattedPage <= 1 ? "opacity-50 pointer-events-none" : ""
						}`}
					>
						Previous
					</Link>

					<span>
						Page {formattedPage} of {totalPages}
					</span>

					<Link
						href={`/beers?page=${formattedPage + 1}`}
						className={`px-3 py-2 border rounded ${
							formattedPage >= totalPages
								? "opacity-50 pointer-events-none"
								: ""
						}`}
					>
						Next
					</Link>
				</div>
			</div>
		</main>
	);
}
