import SearchBar from "../components/interface/SearchBar";
import { getSearch } from "../utils/requests/searchRequests";

type Props = {
	searchParams?: { query?: string };
};

export default async function SearchPage({ searchParams }: Props) {
	const query = (searchParams?.query ?? "").trim();

	const results = await getSearch(query, limit, offset)
	return (
		<main className="min-h-screen bg-white p-4">
			<div className="mx-auto max-w-3xl">
				<div className="mb-4">
					<SearchBar />
				</div>

				<section>
					{query === "" ? (
						<p className="text-sm text-gray-600">Enter a search term to see results.</p>
					) : results.data.length === 0 ? (
						<p className="text-sm text-gray-600">No results for “{query}”.</p>
					) : (
						<ul className="space-y-3">
							{results.data.map((r) => (
								<li
									key={r}
									className="rounded-md border border-gray-100 p-3 text-sm hover:bg-gray-50"
								>
									{r}
								</li>
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}