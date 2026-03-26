"use client";

import { createServerReview } from "@/app/actions/review";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createNewfileSchema,
	CreateReviewInput,
	CreateReviewSchema,
} from "@/app/utils/schemas/reviewSchema";
import { useEffect } from "react";
import TextArea from "../../form/TextArea";
import RatingField from "../../form/RatingField";
import ImageField from "./ImageField";
import { Review } from "@/app/utils/def";

export default function CreateBeerReviewForm({
	id,
	onReviewCreated,
}: {
	id: string;
	onReviewCreated?: (res: Review) => void;
}) {
	const form = useForm<CreateReviewInput>({
		resolver: zodResolver(CreateReviewSchema),
		defaultValues: { photos: [], rating: undefined, review: "" },
		resetOptions: {
			keepDirtyValues: false,
			keepErrors: false,
		},
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

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	const onSubmitForm: SubmitHandler<CreateReviewInput> = async (data) => {
		// Convert data to FormData
		const formData = new FormData();
		formData.append("beer_id", data.beer_id);
		formData.append("review", data.review);
		formData.append("rating", String(data.rating));
		if (data.photos && data.photos.length > 0) {
			data.photos.forEach((file) => {
				formData.append("photos", file);
			});
		}
		const res = await createServerReview(formData);
		if (res.error) {
			setError("root", { type: "server", message: res.error });
			return;
		}
		onReviewCreated?.(res);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmitForm)}
			className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
		>
			<input {...register("beer_id")} type="hidden" name="beer_id" value={id} />

			{/* Photo Upload */}

			<ImageField<CreateReviewInput>
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
			{errors?.root && (
				<p className="text-sm text-red-500">{errors?.root?.message}</p>
			)}

			{/* Submit */}
			<div className="pt-2">
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
				>
					{isSubmitting ? "送信中…" : "レビューを送信"}
				</button>
			</div>
		</form>
	);
}
