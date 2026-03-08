"use client";

import { createServerReview } from "@/app/actions/review";
import Image from "next/image";
import { Beer } from "@/app/utils/def";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createNewfileSchema,
	CreateReviewInput,
	CreateReviewSchema,
} from "@/app/utils/schemas/reviewSchema";
import Dropzone from "react-dropzone";
import { useEffect, useState } from "react";

export default function CreateBeerReviewForm({ beer }: { beer: Beer }) {
	const [dropError, setDropError] = useState<string[]>([]);
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
		}
	};

	const errorMessages: Record<string, string> = {
		"file-too-large": "This file exceeds the 1 MB limit.",
		"file-invalid-type": "Only image files are allowed.",
	};
	return (
		<form
			onSubmit={handleSubmit(onSubmitForm)}
			className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
		>
			<input
				{...register("beer_id")}
				type="hidden"
				name="beer_id"
				value={beer.id}
			/>

			{/* Photo Upload */}
			<div className="space-y-2">
				<label className="font-semibold text-gray-700">Photos</label>

				<Controller
					name="photos"
					control={control}
					render={({ field: { onChange, value } }) => (
						<div>
							<Dropzone
								accept={{ "image/*": [] }}
								maxSize={1 * 1024 * 1024}
								maxFiles={4}
								onDrop={(acceptedFiles, rejectedFiles) => {
									setDropError([]);

									if (rejectedFiles.length > 0) {
										const customErrors = rejectedFiles.flatMap((r) =>
											r.errors.map((e) => errorMessages[e.code] || e.message),
										);
										setDropError(customErrors);
										return;
									}

									const zodErrors: string[] = [];
									acceptedFiles.forEach((file) => {
										const result = createNewfileSchema.safeParse(file);
										if (!result.success) {
											zodErrors.push(
												...result.error.errors.map((err) => err.message),
											);
										}
									});

									if (zodErrors.length > 0) {
										setDropError(zodErrors);
										return;
									}

									onChange([...(value || []), ...acceptedFiles]);
								}}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition"
									>
										<input {...getInputProps()} />
										<p className="text-gray-600 text-sm">
											Drag & drop photos here or click to upload
										</p>
										<p className="text-xs text-gray-400 mt-1">
											Up to 4 images • Max 1MB each
										</p>
									</div>
								)}
							</Dropzone>

							{/* Image previews */}
							{value && value.length > 0 && (
								<ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
									{value.map((file, idx) => (
										<li
											key={idx}
											className="relative group border rounded-lg overflow-hidden"
										>
											<Image
												src={URL.createObjectURL(file)}
												alt={file.name}
												width={150}
												height={150}
												className="object-cover w-full h-32"
												onLoad={(e) => {
													URL.revokeObjectURL(
														(e.target as HTMLImageElement).src,
													);
												}}
											/>

											<button
												type="button"
												onClick={() => {
													const newFiles = value.filter((_, i) => i !== idx);
													onChange(newFiles);
												}}
												className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
											>
												✕
											</button>
										</li>
									))}
								</ul>
							)}

							{dropError.length > 0 && (
								<ul className="text-red-500 text-sm mt-2 space-y-1">
									{dropError.map((err, idx) => (
										<li key={idx}>{err}</li>
									))}
								</ul>
							)}
						</div>
					)}
				/>
			</div>

			{/* Review */}
			<div className="space-y-2">
				<label htmlFor="review" className="font-semibold text-gray-700">
					Review
				</label>

				<textarea
					{...register("review")}
					id="review"
					rows={5}
					placeholder="What did you think about this beer?"
					className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
				/>

				{errors?.review && (
					<p className="text-sm text-red-500">{errors?.review?.message}</p>
				)}
			</div>

			{/* Rating */}
			<div className="space-y-2">
				<label className="font-semibold text-gray-700">Rating</label>

				<fieldset className="flex flex-row-reverse justify-end gap-1 text-3xl">
					{[5, 4, 3, 2, 1].map((star) => (
						<span key={star}>
							<input
								type="radio"
								id={`star${star}`}
								value={star}
								className="peer hidden"
								{...register("rating")}
							/>
							<label
								htmlFor={`star${star}`}
								className="cursor-pointer text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 transition"
							>
								★
							</label>
						</span>
					))}
				</fieldset>

				{errors?.rating && (
					<p className="text-sm text-red-500">{errors?.rating?.message}</p>
				)}
			</div>

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
					{isSubmitting ? "Submitting..." : "Submit Review"}
				</button>
			</div>
		</form>
	);
}
