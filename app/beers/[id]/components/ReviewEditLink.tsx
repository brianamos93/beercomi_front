"use client";
import { useAuth } from "@/app/components/AuthProvider";
import Link from "next/link";

export default function ReviewEditLink({ beer_id, review_id, author_id }: { beer_id: string, review_id: string, author_id: string }) {
    const { user } = useAuth();

    if (!user || user.id !== author_id) return null;

    return (
        <Link
            href={`/beers/${beer_id}/review/${review_id}/edit`}
            className="text-yellow-600 hover:underline font-semibold"
        >
            レビューを編集
        </Link>
    );
}