"use client";
import { useEffect, useState } from "react";
import { getBreweryBeers } from "@/app/utils/requests/breweryRequests";
import { Beer } from "@/app/utils/def";
import BeerCard from "@/app/components/beer/BeerCard";
import { PaginationUI } from "@/app/components/interface/paginationBase";

const LIMIT = 10;

interface Props {
    breweryId: string;
    initialPage: number;
}

export default function BreweryBeerList({ breweryId, initialPage }: Props) {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const offset = (page - 1) * LIMIT;

        getBreweryBeers({ id: breweryId, limit: LIMIT, offset }).then((data) => {
            if (cancelled) return;
            setBeers(data.beers ?? []);
            setTotalPages(
                Math.max(1, Math.ceil((data.pagination?.total ?? 0) / LIMIT)),
            );
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [breweryId, page]);

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        setPage(newPage);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Beers</h2>

            {loading ? (
                <p className="text-gray-400 text-center">Loading beers…</p>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    {beers.length > 0 ? (
                        beers.map((beer: Beer) => (
                            <div key={beer.id} className="w-full max-w-lg shadow-lg">
                                <BeerCard type="nobrewery" entry={beer} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No beers yet.</p>
                    )}
                </div>
            )}

            <div className="mt-6">
                <PaginationUI
                    currentPage={page}
                    totalPages={totalPages}
                    previousAction={
                        page > 1 ? () => handlePageChange(page - 1) : undefined
                    }
                    nextAction={
                        page < totalPages ? () => handlePageChange(page + 1) : undefined
                    }
                />
            </div>
        </div>
    );
}