"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";

export default function SearchBar() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [term, setTerm] = useState(searchParams.get("query") ?? "");

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set("query", term);
		} else {
			params.delete("query");
		}

		router.push(`/search?${params.toString()}`);

		
	}

	return (
		<form onSubmit={handleSubmit} className="relative flex flex-1 shrink-0">
			<label htmlFor="search" className="sr-only">
				Search
			</label>

			<input
				id="search"
				className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
				placeholder="Search..."
				value={term}
				onChange={(e) => setTerm(e.target.value)}
			/>

			<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
		</form>
	);
}
