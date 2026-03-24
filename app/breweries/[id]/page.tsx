import { notFound } from "next/navigation";
import { getBreweriesList, getBrewery } from "@/app/utils/requests/breweryRequests";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";
import { Brewery } from "@/app/utils/def";
import BreweryCardDetailed from "./components/BreweryCardDetailed";
import BreweryDynamicSection from "./components/BreweryDynamicSection";
import BreweryBeerList from "./components/BreweryBeerList";
import { Metadata } from "next";

export async function generateStaticParams() {
  const breweries = await getBreweriesList()
  return breweries.map((brewery: Brewery) => ({
	id: brewery.id
  }))
}

export async function generateMetadata({ params }: { params: Brewery }): Promise<Metadata> {
  const brewery = await getBrewery(params.id);

  return {
    title: `${brewery.name}の醸造所情報・ビール一覧`,
    description: `${brewery.name}の所在地や設立年などの基本情報に加え、醸造しているビール一覧を掲載。レビューや評価を参考に、このブルワリーの魅力をチェックしましょう。`,
  };
}

export default async function BreweryPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: SearchParams;
}) {
    const { id } = await params;
    const searchParamsPage = await searchParams;
    const page = Number(searchParamsPage.page) || 1;


    const brewery = await getBrewery(id); 
    if (!brewery) notFound();

    return (
        <main className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 space-y-6">
                {/* Renders immediately from static cache */}
                <BreweryCardDetailed brewery={brewery} />

                {/* Streams in after auth/favorite check resolves */}
                <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded" />}>
                    <BreweryDynamicSection
                        breweryId={brewery.id}
                        authorId={brewery.author_id}
                    />
                </Suspense>

                {/* Beer list with pagination */}
                <BreweryBeerList
					breweryId={brewery.id} initialPage={page}/>
            </div>
        </main>
    );
}