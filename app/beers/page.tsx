import Link from "next/link";
import { getBeers } from "../utils/requests/beerRequests";
import { cookies } from "next/headers";
import { PaginationLinks } from "../components/interface/ServerPagination";
import { PlusIcon } from "@heroicons/react/24/solid";
import BeerList from "./components/BeerList";
import { Suspense } from "react";
import BeersLoading from "./components/BeersLoading";
import { Metadata } from "next";

type Props = {
  searchParams: { page?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
	const page = Number(searchParams.page) || 1;

	const title =
		page === 1
			? "ビール一覧 "
			: `ビール一覧（${page}ページ目）`;

	const description =
		page === 1
			? "ビールの評価・レビューを一覧でチェックできるページです。さまざまなビールを探して、自分好みの一本を見つけましょう。"
			: `ビール一覧の${page}ページ目です。レビューや評価を参考に、多様なビールを比較・検索できます。`;

	return {
		title,
		description,
	};
}

export default async function beers({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;

	const page = Number(params.page) || 1;

	const token = (await cookies()).get("token")?.value;

	return (
		<main>
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4 text-center">ビール一覧</h1>

				{token && (
					<div className="flex justify-center my-6">
						<Link
							href="/beers/new"
							className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 text-black font-semibold rounded-lg shadow hover:bg-amber-500 transition"
						>
							<PlusIcon className="w-5 h-5" />
							ビール登録
						</Link>
					</div>
				)}

				<Suspense fallback={<BeersLoading />}>
					<BeerList page={page} />
				</Suspense>
			</div>
		</main>
	);
}
