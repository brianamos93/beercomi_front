"use client";

import { editServerReview } from "@/app/actions/review";
import { Beer, Review } from "@/app/utils/def";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ExistingFile,
	NewFile,
	EditReviewInput,
	EditReviewSchema,
	createNewfileSchema,
} from "@/app/utils/schemas/reviewSchema";
import { useEffect } from "react";
import TextArea from "../../form/TextArea";
import RatingField from "../../form/RatingField";
import ImageField from "./ImageField";

export default function EditBeerReviewForm({
	beer,
	review,
}: {
	beer: Beer;
	review: Review;
}) {
	const form = useForm<EditReviewInput>({
		resolver: zodResolver(EditReviewSchema),
		defaultValues: {
			beer_id: beer.id,
			review: review.review,
			rating: review.rating,
			photos: review.photos.map((p: any) => ({
				id: p.id,
				url: p.photo_url,
				type: "existing" as const,
				markedForDelete: false,
			})),
		},
		resetOptions: { keepDirtyValues: false, keepErrors: false },
	});

	const {
		register,
		handleSubmit,
		reset,
		control,
		setError,
		watch,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = form;

	// Reset after successful submit
	useEffect(() => {
		if (isSubmitSuccessful) reset();
	}, [isSubmitSuccessful, reset]);

	const onSubmitForm: SubmitHandler<EditReviewInput> = async (data) => {
		try {
			const formData = new FormData();
			formData.append("beer_id", data.beer_id);
			formData.append("review", data.review);
			formData.append("rating", String(data.rating));

			// Split photos
			const kept = data.photos.filter(
				(p): p is ExistingFile => p.type === "existing" && !p.markedForDelete,
			);
			const deleted = data.photos.filter(
				(p): p is ExistingFile =>
					p.type === "existing" && p.markedForDelete === true,
			);
			const newFiles = data.photos
				.filter((p): p is NewFile => p.type === "new")
				.map((p) => p.file);

			formData.append("kept", JSON.stringify(kept.map((f) => f.id)));
			formData.append("deleted", JSON.stringify(deleted.map((f) => f.id)));
			newFiles.forEach((file) => formData.append("photos", file));

			// Call API
			const res = await editServerReview(review.id, formData);

			if (res?.error) {
				setError("root.serverError", {
					type: "server",
					message: res.error || "Failed to save review.",
				});
				return;
			}
		} catch (err: any) {
			setError("root.serverError", {
				type: "server",
				message:
					err?.message ||
					"Something went wrong. Please check your connection and try again.",
			});
		}
	};

	return (
		<form
			className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
			onSubmit={handleSubmit(onSubmitForm)}
		>
			<h2 className="text-xl font-semibold text-sky-700">Edit Review</h2>
			<input type="hidden" {...register("beer_id")} value={beer.id} />

			<ImageField<EditReviewInput>
				name="photos"
				label="レビュー画像："
				control={control}
				errors={errors}
				zodSchema={createNewfileSchema}
				numberOfFiles={4}
			/>

			{/* Review */}

			<TextArea
				name="review"
				label="レビュー："
				register={register}
				errors={errors}
			/>

			{/* Rating */}

			<RatingField
				name="rating"
				label="評価："
				register={register}
				errors={errors}
				watch={watch}
			/>

			{/* Server error */}
			{errors?.root?.serverError && (
				<p className="text-sm text-red-500">
					{errors.root.serverError.message}
				</p>
			)}

			<div className="pt-2">
				<button
					className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? "保存中…" : "保存"}
				</button>
			</div>
		</form>
	);
}
