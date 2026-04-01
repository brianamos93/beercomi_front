import Link from "next/link";
import { cookies } from "next/headers";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Suspense } from "react";
import BreweriesLoading from "./components/BreweriesLoading";
import BreweryList from "./components/BreweryList";
import { Metadata } from "next";

type Props = {
	searchParams: { page?: string };
};

export async function generateMetadata({
	searchParams,
}: Props): Promise<Metadata> {
	const page = Number(await searchParams.page) || 1;

	const title =
		page === 1 ? "ブルワリー一覧 " : `ブルワリー一覧（${page}ページ目）`;

	const description =
		page === 1
			? "全国のブルワリー（醸造所）を一覧でチェックできるページです。さまざまなブルワリーを探して、個性豊かなクラフトビールの魅力に出会いましょう。"
			: `ブルワリー一覧の${page}ページ目です。各醸造所の特徴や取り扱いビールを比較しながら、お気に入りのブルワリーを見つけることができます。`;

	return {
		title,
		description,
	};
}

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
				<h1 className="text-2xl font-bold mb-4 text-center">醸造所一覧</h1>

				{/* Instant render */}
				{token && (
					<div className="flex justify-center my-6">
						<Link
							href="/breweries/new"
							className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 text-black font-semibold rounded-lg shadow hover:bg-amber-500 transition"
						>
							<PlusIcon className="w-5 h-5" />
							醸造所を登録
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
