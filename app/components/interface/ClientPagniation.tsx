"use client";

import { useRouter } from "next/navigation";
import { PaginationUI } from "./paginationBase"; 

export function PaginationRouter({ currentPage, totalPages }: {currentPage: number, totalPages: number}) {
  const router = useRouter();

  return (
    <PaginationUI
      currentPage={currentPage}
      totalPages={totalPages}
      previousAction={() => router.push(`?page=${currentPage - 1}`)}
      nextAction={() => router.push(`?page=${currentPage + 1}`)}
    />
  );
}