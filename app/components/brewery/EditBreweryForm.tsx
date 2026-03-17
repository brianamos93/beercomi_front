"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { updateServerBrewery } from "../../actions/brewery";
import {
	EditBreweryInput,
	EditBrewerySchema,
	newCoverImageSchema,
} from "@/app/utils/schemas/brewerySchema";
import { Brewery } from "../../utils/def";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import url from "@/app/utils/utils";

export default function EditBreweryForm({ brewery }: { brewery: Brewery }) {
	let coverImageUrl;
	if (!brewery.cover_image) {
		coverImageUrl = undefined;
	} else {
		coverImageUrl = url + brewery.cover_image;
	}
	const [dropError, setDropError] = useState<string[]>([]);
	const form = useForm<EditBreweryInput>({
		resolver: zodResolver(EditBrewerySchema),
		defaultValues: {
			name: brewery.name,
			location: brewery.location,
			date_of_founding: brewery.date_of_founding,
			cover_image: {
				url: coverImageUrl,
				type: "existing" as const,
			},
			deleteCoverImage: false,
		},
		resetOptions: {
			keepDefaultValues: false,
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

	const onSubmit = async (data: EditBreweryInput) => {
		const formData = new FormData();
		if (
			data.cover_image !== null &&
			typeof data.cover_image === "object" &&
			"file" in data.cover_image &&
			data.cover_image.file
		) {
			formData.append("cover_image", data.cover_image.file);
		}

		formData.append("name", data.name);
		formData.append("location", data.location);
		formData.append("date_of_founding", data.date_of_founding);

		formData.append("deleteCoverImage", String(data.deleteCoverImage));
		const res = await updateServerBrewery(brewery.id, formData);

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
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow"
		>
			{/* Cover Image */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Cover Image
				</label>

				<Controller
					name="cover_image"
					control={control}
					render={({ field: { onChange, value } }) => (
						<div>
							<Dropzone
								accept={{ "image/*": [] }}
								maxSize={1 * 1024 * 1024}
								maxFiles={1}
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
									if (acceptedFiles[0]) {
										const result = newCoverImageSchema.safeParse(
											acceptedFiles[0],
										);
										if (!result.success) {
											zodErrors.push(
												...result.error.errors.map((err) => err.message),
											);
										}
									}

									if (zodErrors.length > 0) {
										setDropError(zodErrors);
										return;
									}

									if (acceptedFiles[0]) {
										onChange({
											file: acceptedFiles[0],
											preview: URL.createObjectURL(acceptedFiles[0]),
											type: "new",
										});
									} else {
										onChange(null);
									}
								}}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sky-500 transition"
									>
										<input {...getInputProps()} />
										<p className="text-sm text-gray-500 text-center">
											Drag & drop an image here
										</p>
										<p className="text-xs text-gray-400 mt-1">
											or click to select (max 1MB)
										</p>
									</div>
								)}
							</Dropzone>

							{value &&
								((value.type === "existing" && value.url) ||
									(value.type !== "existing" && value.preview)) && (
									<div className="mt-3 relative border rounded-lg p-2 w-40">
										<Image
											src={
												value.type === "existing" ? value.url : value.preview
											}
											alt="uploaded"
											width={150}
											height={150}
											className="object-contain w-full h-32 rounded"
										/>
										<button
											type="button"
											className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
											onClick={() => {
												onChange(null);
												form.setValue("deleteCoverImage", true);
											}}
										>
											✕
										</button>
									</div>
								)}

							{dropError.length > 0 && (
								<ul className="text-red-500 mt-2 text-sm space-y-1">
									{dropError.map((err, idx) => (
										<li key={idx}>{err}</li>
									))}
								</ul>
							)}
						</div>
					)}
				/>

				{errors.cover_image && (
					<p className="mt-2 text-sm text-red-500">
						{errors.cover_image.message as string}
					</p>
				)}
			</div>

			{/* Name */}
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Name
				</label>
				<input
					id="name"
					type="text"
					placeholder="Name"
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
					{...register("name", { required: "Name is required." })}
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>

			{/* Location */}
			<div>
				<label
					htmlFor="location"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Location
				</label>
				<input
					id="location"
					type="text"
					placeholder="Location"
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
					{...register("location", { required: "Location is required." })}
				/>
				{errors.location && (
					<p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
				)}
			</div>

			{/* Date of Founding */}
			<div>
				<label
					htmlFor="date_of_founding"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Date of Founding
				</label>
				<input
					id="date_of_founding"
					type="text"
					placeholder="YYYY"
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
					{...register("date_of_founding", {
						required: "Date of founding is reqired.",
					})}
				/>
				{errors.date_of_founding && (
					<p className="mt-1 text-sm text-red-500">
						{errors.date_of_founding.message}
					</p>
				)}
			</div>

			{/* Server Error */}
			{errors?.root && (
				<p className="text-sm text-red-500">{errors?.root?.message}</p>
			)}

			{/* Submit */}
			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full bg-sky-600 text-white font-medium py-2.5 rounded-lg hover:bg-sky-700 disabled:opacity-50"
			>
				{isSubmitting ? "Loading..." : "Update"}
			</button>
		</form>
	);
}
