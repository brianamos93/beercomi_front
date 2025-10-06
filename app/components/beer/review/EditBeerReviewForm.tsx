"use client";

import { editServerReview } from "@/app/actions/review";
import Image from "next/image";
import { Beer, Review } from "@/app/utils/def";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ExistingFile,
	NewFile,
	FileItem,
	EditReviewInput,
	EditReviewSchema,
	createNewfileSchema,
} from "@/app/utils/schemas/reviewSchema";
import Dropzone from "react-dropzone";
import { useEffect, useState } from "react";

export default function EditBeerReviewForm({
	beer,
	review,
}: {
	beer: Beer;
	review: Review;
}) {
	const [dropError, setDropError] = useState<string[]>([]);
	const form = useForm<EditReviewInput>({
		resolver: zodResolver(EditReviewSchema),
		defaultValues: {
			beer_id: beer.id,
			review: review.review,
			rating: String(Math.floor(review.rating)),
			photos: review.photos.map((p: any) => ({
				id: p.id,
				url: "http://localhost:3005" + p.photo_url,
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

	const photos = watch("photos");

	// Cleanup previews
	useEffect(() => {
		return () => {
			photos.forEach((p) => {
				if (p.type === "new" && p.preview) URL.revokeObjectURL(p.preview);
			});
		};
	}, [photos]);

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
				(p): p is ExistingFile => p.type === "existing" && !p.markedForDelete
			);
			const deleted = data.photos.filter(
				(p): p is ExistingFile => p.type === "existing" && p.markedForDelete
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

	const errorMessages: Record<string, string> = {
		"file-too-large": "This file exceeds the 1 MB limit.",
		"file-invalid-type": "Only JPG, PNG, WEBP are allowed.",
	};
	const selectedRating = Number(watch("rating"));

	return (
		<form onSubmit={handleSubmit(onSubmitForm)}>
			<input type="hidden" {...register("beer_id")} value={beer.id} />

			{/* Photos */}
			<div>
				<label htmlFor="photos">Upload photos:</label>
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

									// Dropzone errors
									if (rejectedFiles.length > 0) {
										const customErrors = rejectedFiles.flatMap((r) =>
											r.errors.map((e) => errorMessages[e.code] || e.message)
										);
										setDropError(customErrors);
										return;
									}

									// Zod validation
									const zodErrors: string[] = [];
									acceptedFiles.forEach((file) => {
										const result = createNewfileSchema.safeParse(file);
										if (!result.success) {
											zodErrors.push(
												...result.error.errors.map((err) => err.message)
											);
										}
									});

									if (zodErrors.length > 0) {
										setDropError(zodErrors);
										return;
									}

									// Append new files
									const newItems: FileItem[] = acceptedFiles.map((f) => ({
										file: f,
										preview: URL.createObjectURL(f),
										type: "new",
									}));
									onChange([...(value || []), ...newItems]);
								}}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="p-6 border-2 border-dashed rounded cursor-pointer"
									>
										<input {...getInputProps()} />
										<p>Drag & drop files here, or click to select</p>
									</div>
								)}
							</Dropzone>

							{/* Preview */}
							{value && value.length > 0 && (
								<ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
									{value
										.filter(
											(file) =>
												!(file.type === "existing" && file.markedForDelete)
										)
										.map((file, idx) => (
											<li
												key={idx}
												className="relative group border rounded p-1"
											>
												<Image
													src={
														file.type === "existing" ? file.url : file.preview
													}
													alt="uploaded"
													width={150}
													height={150}
													className="object-scale-down w-full h-32 rounded"
												/>
												<button
													type="button"
													className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-80 hover:opacity-100"
													onClick={() => {
														let updated: FileItem[];
														if (file.type === "existing") {
															updated = value.map((f, j) =>
																j === idx && f.type === "existing"
																	? { ...f, markedForDelete: true }
																	: f
															);
														} else {
															updated = value.filter((_, j) => j !== idx);
														}
														onChange([...updated]);
													}}
												>
													✕
												</button>
											</li>
										))}
								</ul>
							)}

							{/* File errors */}
							{dropError.length > 0 && (
								<ul className="text-red-500 mt-2">
									{dropError.map((err, idx) => (
										<li key={idx}>{err}</li>
									))}
								</ul>
							)}
						</div>
					)}
				/>
				{errors?.photos && (
					<p className="mt-2 text-sm text-red-500">{errors.photos.message}</p>
				)}
			</div>

			{/* Review */}
			<div>
				<label htmlFor="review">Review:</label>
				<textarea {...register("review")} id="review" cols={30} rows={10} />
				{errors?.review && (
					<p className="mt-2 text-sm text-red-500">{errors.review.message}</p>
				)}
			</div>

			{/* Rating */}
			<div>
				<fieldset className="flex flex-row-reverse justify-center gap-1">
					{[5, 4, 3, 2, 1].map((star) => (
						<div key={star}>
							<input
								type="radio"
								id={`star${star}`}
								value={String(star)}
								className="peer hidden"
								{...register("rating")}
							/>
							<label
								htmlFor={`star${star}`}
								className={`cursor-pointer text-2xl 
          ${selectedRating >= star ? "text-yellow-400" : "text-gray-300"} 
          hover:text-yellow-300`}
							>
								★
							</label>
						</div>
					))}
				</fieldset>
				{errors?.rating && (
					<p className="mt-2 text-sm text-red-500">{errors.rating.message}</p>
				)}
			</div>

			{/* Server error */}
			{errors?.root?.serverError && (
				<p className="mt-2 text-sm text-red-500">
					{errors.root.serverError.message}
				</p>
			)}

			<div>
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Loading..." : "Save changes"}
				</button>
			</div>
		</form>
	);
}
