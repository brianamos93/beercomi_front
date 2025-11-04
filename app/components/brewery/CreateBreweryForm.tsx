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
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
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
											r.errors.map((e) => errorMessages[e.code] || e.message)
										);
										setDropError(customErrors);
										return;
									}

									// Zod validation for accepted file
									const zodErrors: string[] = [];
									if (acceptedFiles[0]) {
										const result = newCoverImageSchema.safeParse(
											acceptedFiles[0]
										);
										if (!result.success) {
											zodErrors.push(
												...result.error.errors.map((err) => err.message)
											);
										}
									}

									if (zodErrors.length > 0) {
										setDropError(zodErrors);
										return;
									}

									// Only keep the first file
									onChange(acceptedFiles[0] || null);
								}}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										{...getRootProps()}
										className="p-6 border-2 border-dashed rounded cursor-pointer"
									>
										<input {...getInputProps()} />
										<p>Drag & drop a cover image here, or click to select</p>
									</div>
								)}
							</Dropzone>

							{value && (
								<div className="mt-2 relative group border rounded p-1 w-fit">
									<Image
										src={URL.createObjectURL(value)}
										alt={value.name}
										width={150}
										height={150}
										className="object-scale-down w-full h-32 rounded"
										onLoad={(e) => {
											URL.revokeObjectURL((e.target as HTMLImageElement).src);
										}}
									/>
									<button
										type="button"
										className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-80 hover:opacity-100"
										onClick={() => onChange(null)}
									>
										✕
									</button>
								</div>
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
				{errors.cover_image && (
					<p className="mt-2 text-sm text-red-500">
						{errors.cover_image.message as string}
					</p>
				)}
			</div>
			<div>
				<input
					type="text"
					placeholder="Name"
					{...register("name", { required: "Name is required" })}
				/>
				<div id="name-error" aria-live="polite" aria-atomic="true">
					{errors?.name && (
						<p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
					)}
				</div>
			</div>
			<div>
				<input
					type="text"
					placeholder="Location"
					{...register("location", { required: "Location is required." })}
				/>
				<div id="location-error" aria-live="polite" aria-atomic="true">
					{errors?.location && (
						<p className="mt-2 text-sm text-red-500">
							{errors.location.message}
						</p>
					)}
				</div>
			</div>
			<div>
				<label htmlFor="date_of_founding">Date of Founding:</label>
				<input
					type="text"
					id="date_of_founding"
					{...register("date_of_founding", {
						required: "Date of founding is required.",
					})}
				/>
				<div id="color-error" aria-live="polite" aria-atomic="true">
					{errors?.date_of_founding && (
						<p className="mt-2 text-sm text-red-500">
							{errors.date_of_founding.message}
						</p>
					)}
				</div>
			</div>

			<div id="server-error" aria-live="polite" aria-atomic="true">
				{errors?.root && (
					<p className="mt-2 text-sm text-red-500">{errors?.root?.message}</p>
				)}
			</div>
			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Loading" : "Submit"}
			</button>
		</form>
	);
}
