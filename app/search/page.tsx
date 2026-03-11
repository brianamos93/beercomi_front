import Link from "next/link";
import SearchBar from "../components/interface/SearchBar";
import { SearchResult } from "../utils/def";
import { getSearch } from "../utils/requests/searchRequests";

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

export default async function SearchPage(props: Props) {
	const routes: Record<string, string> = {
		brewery: "breweries",
		beer: "beers",
	};
	const searchParams = await props.searchParams;
	const query = searchParams?.query || "";
	const currentPage = Math.max(1, Number(searchParams?.page) || 1);

	const limit = 10;
	const offset = (currentPage - 1) * limit;

	// Avoid executing the search when query is empty; return cleared results instead
	let results: { data: SearchResult[]; pagination: { total: number } };

	if (query.trim() === "") {
		results = { data: [], pagination: { total: 0 } };
	} else {
		results = await getSearch(query, limit, offset);
	}

	const totalPages = Math.max(1, Math.ceil(results.pagination.total / limit));

	const buildHref = (page: number) => {
		const params = new URLSearchParams();
		if (query.trim() !== "") params.set("query", query);
		params.set("page", String(page));
		return `/search?${params.toString()}`;
	};

	return (
		<main className="min-h-screen bg-white p-4">
			<div className="mx-auto max-w-3xl">
				<div className="mb-4">
					<SearchBar />
				</div>

				<section>
					{query === "" ? (
						<p className="text-sm text-gray-600">
							Enter a search term to see results.
						</p>
					) : results.data.length === 0 ? (
						<p className="text-sm text-gray-600">No results for “{query}”.</p>
					) : (
						<ul className="space-y-3">
							{results.data.map((r: SearchResult) => (
								<li
									key={r.id}
									className="rounded-md border border-gray-100 p-3 text-sm hover:bg-gray-50"
								>
									<Link href={`/${routes[r.type]}/${r.id}`}>{r.name}</Link>
								</li>
							))}
						</ul>
					)}
				</section>

				<div className="flex justify-between mt-6">
					<Link
						href={buildHref(currentPage - 1)}
						className={`px-3 py-2 border rounded ${
							currentPage <= 1 ? "opacity-50 pointer-events-none" : ""
						}`}
					>
						Previous
					</Link>

					<span>
						Page {currentPage} of {totalPages}
					</span>

					<Link
						href={buildHref(currentPage + 1)}
						className={`px-3 py-2 border rounded ${
							currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""
						}`}
					>
						Next
					</Link>
				</div>
			</div>
		</main>
	);
}
