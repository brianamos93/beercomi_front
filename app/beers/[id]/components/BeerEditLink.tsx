"use client";
import { useAuth } from "@/app/components/AuthProvider";
import Link from "next/link";

export default function BeerEditLink({
	beer_id,
	author_id,
}: {
	beer_id: string;
	author_id: string;
}) {
	const { user } = useAuth();

	if (!user || user.id !== author_id) return null;

	return (
		<Link
			href={`/beers/${beer_id}/edit`}
			className="px-4 py-2 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-lg hover:bg-yellow-200"
		>
			ビールを編集
		</Link>
	);
}
