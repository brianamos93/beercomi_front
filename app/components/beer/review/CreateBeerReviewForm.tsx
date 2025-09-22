"use client";

import { createServerReview } from "@/app/actions/review";
import Image from "next/image";
import { Beer } from "@/app/utils/def";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	fileSchema,
	ReviewInput,
	ReviewSchema,
} from "@/app/utils/schemas/reviewSchema";
import Dropzone from "react-dropzone";
import { useEffect, useState } from "react";

export default function CreateBeerReviewForm({ beer }: { beer: Beer }) {
	const [dropError, setDropError] = useState<string[]>([]);
	const form = useForm<ReviewInput>({
		resolver: zodResolver(ReviewSchema),
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

	const onSubmitForm: SubmitHandler<ReviewInput> = async (data) => {
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
		if(res.error) {
			setError('root.serverError', res.error)
		}
	
	};

	const errorMessages: Record<string, string> = {
		"file-too-large": "This file exceeds the 1 MB limit.",
		"file-invalid-type": "Only image files are allowed.",
	};
	return (
		<form onSubmit={handleSubmit(onSubmitForm)}>
			<input
				{...register("beer_id")}
				type="hidden"
				name="beer_id"
				value={beer.id}
			/>
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
									// Clear previous errors
									setDropError([]);

									// Handle Dropzone errors first
									if (rejectedFiles.length > 0) {
										const customErrors = rejectedFiles.flatMap((r) =>
											r.errors.map((e) => errorMessages[e.code] || e.message)
										);
										setDropError(customErrors);
										return;
									}

									// Zod validation for accepted files
									const zodErrors: string[] = [];
									acceptedFiles.forEach((file) => {
										const result = fileSchema.safeParse(file);
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

									// Update RHF state if valid
									onChange([...(value || []), ...acceptedFiles]);
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

							{value && value.length > 0 && (
								<ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
									{value.map((file, idx) => (
										<li key={idx} className="relative group border rounded p-1">
											<Image
												src={URL.createObjectURL(file)}
												alt={file.name}
												width={150}
												height={150}
												className="object-scale-down w-full h-32 rounded"
												onLoad={(e) => {
													// Revoke the object URL after the image loads to free memory
													URL.revokeObjectURL(
														(e.target as HTMLImageElement).src
													);
												}}
											/>
											<button
												type="button"
												className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-80 hover:opacity-100"
												onClick={() => {
													const newFiles = value.filter((_, i) => i !== idx);
													onChange(newFiles);
												}}
											>
												✕
											</button>
										</li>
									))}
								</ul>
							)}
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
				<div id="photos-error" aria-live="polite" aria-atomic="true">
					{errors?.photos && (
						<p className="mt-2 text-sm text-red-500">
							{errors?.photos?.message}
						</p>
					)}
				</div>
			</div>
			<div>
				<label htmlFor="review">Review:</label>
				<textarea
					{...register("review")}
					id="review"
					cols={30}
					rows={10}
				></textarea>
				<div id="review-error" aria-live="polite" aria-atomic="true">
					{errors?.review && (
						<p className="mt-2 text-sm text-red-500">
							{errors?.review?.message}
						</p>
					)}
				</div>
			</div>
			<div>
				<fieldset className="flex flex-row-reverse justify-center gap-1">
					<input
						type="radio"
						id="star5"
						value="5"
						className="peer hidden"
						{...register("rating")}
					/>
					<label
						htmlFor="star5"
						className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300"
					>
						★
					</label>

					<input
						type="radio"
						id="star4"
						value="4"
						className="peer hidden"
						{...register("rating")}
					/>
					<label
						htmlFor="star4"
						className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 peer-checked:~label"
					>
						★
					</label>

					<input
						type="radio"
						id="star3"
						value="3"
						className="peer hidden"
						{...register("rating")}
					/>
					<label
						htmlFor="star3"
						className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 peer-checked:~label"
					>
						★
					</label>

					<input
						type="radio"
						id="star2"
						value="2"
						className="peer hidden"
						{...register("rating")}
					/>
					<label
						htmlFor="star2"
						className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 peer-checked:~label"
					>
						★
					</label>

					<input
						type="radio"
						id="star1"
						value="1"
						className="peer hidden"
						{...register("rating")}
					/>
					<label
						htmlFor="star1"
						className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 peer-checked:~label"
					>
						★
					</label>
				</fieldset>
				<div id="rating-error" aria-live="polite" aria-atomic="true">
					{errors?.rating && (
						<p className="mt-2 text-sm text-red-500">
							{errors?.rating?.message}
						</p>
					)}
				</div>
			</div>
			<div id="server-error" aria-live="polite" aria-atomic="true">
				{errors?.root && (
					<p className="mt-2 text-sm text-red-500">
						{errors?.root?.message}
					</p>
				)}
			</div>
			<div>
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Loading" : "Submit"}
				</button>
			</div>
		</form>
	);
}
