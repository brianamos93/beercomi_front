// BeerPage.tsx
import BeerCardDetailed from "@/app/components/beer/BeerCardDetailed";
import { Suspense } from "react";
import BeerReviewsSection from "./components/BeerReviewsSection";
import BeerDynamicSection from "./components/BeerDynamicSection";
import { notFound } from "next/navigation";
import { getBeer } from "@/app/utils/requests/beerRequests";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function BeerPage({ params, searchParams }: {params: {id: string}, searchParams: SearchParams}) {
  const { id } = await params;
  const beer = await getBeer(id); // SSG — fast
  if (!beer) notFound();

  const searchParamsPage = await searchParams;
  const page = Number(searchParamsPage.page) || 1;

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-8">
      {/* Renders immediately from static cache */}
      <BeerCardDetailed beer={beer} />

      {/* Streams in after auth/favorite check resolves */}
      <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded" />}>
        <BeerDynamicSection beerId={beer.id} authorId={beer.author_id} />
      </Suspense>

      <BeerReviewsSection beerId={beer.id} userId={null} initialPage={page} />
    </main>
  );
}