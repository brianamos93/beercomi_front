// BeerPage.tsx
import BeerCardDetailed from "@/app/components/beer/BeerCardDetailed";
import { Suspense } from "react";
import BeerDynamicSection from "./components/BeerDynamicSection";
import { notFound } from "next/navigation";
import { getBeer, getBeersList } from "@/app/utils/requests/beerRequests";
import { Beer } from "@/app/utils/def";
import { Metadata } from "next";
import ReviewSectionWrapper from "./components/ReviewSectionWrapper";

type SearchParams = { [key: string]: string | string[] | undefined };

export async function generateStaticParams() {
	const beers = await getBeersList();
	return beers.map((beer: Beer) => ({
		id: String(beer.id),
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }> 
}): Promise<Metadata> {
	const { id } = await params;
	const beer = await getBeer(id);

	return {
		title: `${beer.name}の情報・評価・レビュー`,
		description: `${beer.name}の味わいや特徴、スタイル、醸造所「${beer.brewery_name}」の情報を掲載。レビューや評価を参考に、お気に入りのビールを見つけましょう。`,
	};
}

export default async function BeerPage({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams: SearchParams;
}) {
	const { id } = await params;
	const beer = await getBeer(id);
	if (!beer) notFound();

	const searchParamsPage = await searchParams;
	const page = Number(searchParamsPage.page) || 1;

	return (
		<main className="max-w-2xl mx-auto p-4 space-y-8">
			{/* Renders immediately from static cache */}
			<BeerCardDetailed beer={beer} />

			{/* Streams in after auth/favorite check resolves */}
			<Suspense
				fallback={<div className="h-10 animate-pulse bg-muted rounded" />}
			>
				<BeerDynamicSection beerId={beer.id} authorId={beer.author_id} />
			</Suspense>
			<Suspense fallback={<div>読み込み中</div>}>
				<ReviewSectionWrapper beerId={beer.id} initialPage={page} />
			</Suspense>
		</main>
	);
}
