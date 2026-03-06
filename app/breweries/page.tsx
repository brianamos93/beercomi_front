import Link from "next/link";
import BreweryCard from "../components/brewery/BreweryCard";
import { getBreweries } from "../utils/requests/breweryRequests";
import { Brewery } from "../utils/def";
import { cookies } from "next/headers";
import { PaginationLinks } from "../components/interface/ServerPagination";

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
				<h1 className="text-2xl font-bold mb-4">Breweries</h1>

				{token && (
					<Link href="/breweries/new">
						<h2>New Brewery</h2>
					</Link>
				)}

				<ul className="space-y-4">
					{data.map((brewery: Brewery) => (
						<li key={brewery.id}>
							<BreweryCard entry={brewery} />
						</li>
					))}
				</ul>

				<PaginationLinks
					currentPage={formattedPage}
					totalPages={totalPages}
					basePath={`/breweries`}
				/>
			</div>
		</main>
	);
}
