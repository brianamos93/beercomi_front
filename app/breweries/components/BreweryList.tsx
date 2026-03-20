import BreweryCard from "../../components/brewery/BreweryCard";
import { getBreweries } from "../../utils/requests/breweryRequests";
import { Brewery } from "../../utils/def";
import { PaginationLinks } from "../../components/interface/ServerPagination";

export default async function BreweryList({ page }: { page: number }) {
	const limit = 10;
	const offset = (page - 1) * limit;

	const { data, pagination } = await getBreweries({
		offset,
		limit,
	});

	const totalPages = Math.ceil(pagination.total / limit);

	return (
		<>
			<ul className="space-y-4 flex flex-col items-center">
				{data.map((brewery: Brewery) => (
					<li key={brewery.id} className="w-full max-w-md">
						<BreweryCard entry={brewery} />
					</li>
				))}
			</ul>

			<div className="max-w-md mx-auto mt-6">
				<PaginationLinks
					currentPage={page}
					totalPages={totalPages}
					basePath="/breweries"
				/>
			</div>
		</>
	);
}