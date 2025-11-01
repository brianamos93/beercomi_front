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
import { EditBeerInput } from "@/app/utils/schemas/beerSchema";

export default function EditBreweryForm({ brewery }: { brewery: Brewery }) {
	let coverImageUrl;
	if (!brewery.cover_image) {
		coverImageUrl = null;
	} else {
		coverImageUrl = url + brewery.cover_image;
	}
	const [dropError, setDropError] = useState<string[]>([]);
	const [hasMounted, setHasMounted] = useState(false);
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

	useEffect(() => {
		setHasMounted(true);
	}, []);

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
		formData.append("data_of_founding", data.date_of_founding);

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

									// Only keep the first file, and wrap it with preview and type
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
										className="p-6 border-2 border-dashed rounded cursor-pointer"
									>
										<input {...getInputProps()} />
										<p>Drag & drop a cover image here, or click to select</p>
									</div>
								)}
							</Dropzone>

							{value &&
								((value.type === "existing" && value.url) ||
									(value.type !== "existing" && value.preview)) && (
									<div className="mt-2 relative group border rounded p-1 w-fit">
										<Image
											src={
												value.type === "existing" ? value.url : value.preview
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
												onChange(null);
												form.setValue("deleteCoverImage", true);
											}}
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
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					placeholder="Name"
					{...register("name", { required: "Name is required." })}
				/>
				<div id="name-error" aria-live="polite" aria-atomic="true">
					{errors.name && (
						<p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
					)}
				</div>
			</div>
			<div>
				<label htmlFor="location">Location:</label>
				<input
					type="text"
					placeholder="Location"
					{...register("location", { required: "Location is required." })}
				/>
				<div id="location-error" aria-live="polite" aria-atomic="true">
					{errors.location && (
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
						required: "Date of founding is reqired.",
					})}
				/>
				<div id="color-error" aria-live="polite" aria-atomic="true">
					{errors.date_of_founding && (
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
				{isSubmitting ? "Loading" : "Update"}
			</button>
		</form>
	);
}
