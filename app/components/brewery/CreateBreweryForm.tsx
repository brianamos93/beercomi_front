"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { createServerBrewery } from "@/app/actions/brewery";
import {
	CreateBrewerySchema,
	newCoverImageSchema,
} from "@/app/utils/schemas/brewerySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

type FormValues = {
	cover_image?: File | null;
	name: string;
	location: string;
	date_of_founding: string;
};

export default function CreateBeerForm() {
	const [dropError, setDropError] = useState<string[]>([]);
	const form = useForm<FormValues>({
		resolver: zodResolver(CreateBrewerySchema),
		defaultValues: {},
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

	const onSubmit = async (data: FormValues) => {
		const formData = new FormData();
		if (data.cover_image) {
			formData.append("cover_image", data.cover_image);
		}
		formData.append("name", data.name);
		formData.append("location", data.location);
		formData.append("date_of_founding", data.date_of_founding);

		const res = await createServerBrewery(formData);

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

									onChange(acceptedFiles[0] || null);
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

							{value && (
								<div className="mt-3 relative group border rounded-lg p-2 w-40">
									<Image
										src={URL.createObjectURL(value)}
										alt={value.name}
										width={150}
										height={150}
										className="object-contain w-full h-32 rounded"
										onLoad={(e) => {
											URL.revokeObjectURL((e.target as HTMLImageElement).src);
										}}
									/>
									<button
										type="button"
										className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
										onClick={() => onChange(null)}
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
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Name
				</label>
				<input
					type="text"
					placeholder="Brewery name"
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
					{...register("name", { required: "Name is required" })}
				/>
				{errors?.name && (
					<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>

			{/* Location */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Location
				</label>
				<input
					type="text"
					placeholder="City / Country"
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
					{...register("location", { required: "Location is required." })}
				/>
				{errors?.location && (
					<p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
				)}
			</div>

			{/* Founding Date */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Date of Founding
				</label>
				<input
					type="text"
					placeholder="YYYY"
					className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
					{...register("date_of_founding", {
						required: "Date of founding is required.",
					})}
				/>
				{errors?.date_of_founding && (
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
				{isSubmitting ? "Loading..." : "Submit"}
			</button>
		</form>
	);
}
