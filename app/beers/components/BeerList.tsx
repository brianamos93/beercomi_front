import BeerCard from "../../components/beer/BeerCard";
import { getBeers } from "../../utils/requests/beerRequests";
import { Beer } from "../../utils/def";
import { PaginationLinks } from "../../components/interface/ServerPagination";

export default async function BeerList({ page }: { page: number }) {
	const limit = 10;
	const offset = (page - 1) * limit;

	const { data, pagination } = await getBeers({ offset, limit });

	const totalPages = Math.ceil(pagination.total / limit);

	return (
		<>
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
		</>
	);
}