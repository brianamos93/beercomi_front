"use client";

import { useEffect, useState } from "react";
import { getBeerReviews } from "@/app/utils/requests/reviewRequests";
import { Photo, Review } from "@/app/utils/def";
import Image from "next/image";
import CreateBeerReviewForm from "@/app/components/beer/review/CreateBeerReviewForm";
import ReviewEditLink from "./ReviewEditLink";
import { PaginationUI } from "@/app/components/interface/paginationBase";
import { useAuth } from "@/app/components/AuthProvider";

const LIMIT = 10;

interface Props {
	beerId: string;
	initialPage: number;
}

export default function BeerReviewsSection({
	beerId,
	initialPage,
}: Props) {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(initialPage);
	const [loading, setLoading] = useState(true);

	const { user } = useAuth();

	useEffect(() => {
		let cancelled = false;

		const offset = (page - 1) * LIMIT;
		getBeerReviews({ id: beerId, limit: LIMIT, offset }).then((data) => {
			if (cancelled) return;
			setReviews(data.reviews ?? []);
			setTotalPages(
				Math.max(1, Math.ceil((data.pagination?.total ?? 0) / LIMIT)),
			);
			setLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [beerId, page]);

	const handlePageChange = (newPage: number) => {
		setLoading(true);
		setPage(newPage);
	};

	const userHasReviewed = reviews.some((r) => r.author_id === user?.id);

	return (
		<section>
			<h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Reviews</h2>

			{user && !userHasReviewed && (
				<div className="mb-6">
					<CreateBeerReviewForm
						id={beerId}
						onReviewCreated={() => setPage(1)} // refresh to page 1 after posting
					/>
				</div>
			)}

			{loading ? (
				<p className="text-gray-400 text-center">レビューを読み込み中…</p>
			) : (
				<div className="space-y-6">
					{reviews.length > 0 ? (
						reviews.map((review: Review) => (
							<div
								id={review.id}
								key={review.id}
								className="border rounded-xl p-5 bg-white shadow-lg"
							>
								{review.photos && review.photos.length > 0 && (
									<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
										{review.photos.map((photo: Photo) => (
											<Image
												key={photo.id}
												src={photo.photo_url}
												alt="Review photo"
												width={150}
												height={150}
												className="rounded-lg object-cover w-full h-32"
											/>
										))}
									</div>
								)}

								<p className="text-gray-800 mb-4 leading-relaxed">
									{review.review}
								</p>

								<div className="flex items-center justify-between text-sm">
									<div className="space-x-4">
										<span className="text-yellow-600 font-semibold">
											⭐ {review.rating}
										</span>
										<span className="text-gray-500">
											投稿者： {review.author_name}
										</span>
									</div>
									<ReviewEditLink
										beer_id={beerId}
										review_id={review.id}
										author_id={review.author_id}
									/>
								</div>
							</div>
						))
					) : (
						<p className="text-gray-500 text-center">まだレビューがありません。最初のレビューを投稿してみましょう！</p>
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
		</section>
	);
}
