"use client";

import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { createServerBeer } from "../../actions/beer";
import { Beer, Brewery } from "../../utils/def";
import {
	EditBeerInput,
	EditBeerSchema,
	newCoverImageSchema,
} from "@/app/utils/schemas/beerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import url from "@/app/utils/utils";

export default function EditBeerForm({
	beer,
	breweries,
}: {
	beer: Beer;
	breweries: Brewery[];
}) {
	let coverImageUrl
	if (!beer.cover_image) {
		coverImageUrl = null
	} else {
			coverImageUrl = url + beer.cover_image
	}
	const [dropError, setDropError] = useState<string[]>([]);
	const [hasMounted, setHasMounted] = useState(false);
	const form = useForm<EditBeerInput>({
		resolver: zodResolver(EditBeerSchema),
		defaultValues: {
			name: beer.name,
			style: beer.style,
			abv: beer.abv,
			brewery_id: beer.brewery_id,
			color: beer.color,
			ibu: beer.ibu,
			description: beer.description,
			cover_image: {
				url: coverImageUrl,
				type: "existing" as const
			},
			deleteCoverImage: false,
		},
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

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const onSubmit = async (data: EditBeerInput) => {
		const formData = new FormData();

		// Only append a new file if present
		if (
			data.cover_image !== null &&
			typeof data.cover_image === "object" &&
			"file" in data.cover_image &&
			data.cover_image.file
		) {
			formData.append("cover_image", data.cover_image.file);
		}

		formData.append("name", data.name);
		formData.append("style", data.style);
		formData.append("abv", String(data.abv));
		formData.append("brewery_id", data.brewery_id);
		formData.append("description", data.description);
		formData.append("ibu", String(data.ibu));
		formData.append("color", data.color);

		// Always send deleteCoverImage (as "true" or "false")
		formData.append("deleteCoverImage", String(data.deleteCoverImage));

		const res = await createServerBeer(formData);

		if (res.error) {
			setError("root", { type: "server", message: res.error });
		}
	};

	const breweryOptions = breweries.map((brewery) => ({
		value: brewery.id,
		label: brewery.name,
	}));

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
								(
									(value.type === "existing" && value.url) ||
									(value.type !== "existing" && value.preview)
								) && (
									<div className="mt-2 relative group border rounded p-1 w-fit">
										<Image
											src={value.type === "existing" ? value.url : value.preview}
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
				<input
					type="text"
					placeholder="Name"
					{...register("name", { required: "Name is required" })}
				/>
				{errors.name && (
					<p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>
			<div>
				<input type="text" placeholder="Style" {...register("style")} />
				{errors.style && (
					<p className="mt-2 text-sm text-red-500">{errors.style.message}</p>
				)}
			</div>
			<div>
				<input
					type="number"
					step="0.1"
					placeholder="ABV"
					{...register("abv", { valueAsNumber: true })}
				/>
				{errors.abv && (
					<p className="mt-2 text-sm text-red-500">{errors.abv.message}</p>
				)}
			</div>
			<div>
				{hasMounted && (
					<Controller
						name="brewery_id"
						control={control}
						rules={{ required: "Brewery is required" }}
						render={({ field }) => {
							const selectedOption = breweryOptions.find(opt => opt.value === field.value) || null;
							return (
								<Select
									{...field}
									options={breweryOptions}
									value={selectedOption}
									onChange={option => field.onChange(option?.value)}
									placeholder="Select a Brewery"
								/>
							);
						}}
					/>
				)}
				{errors.brewery_id && (
					<p className="mt-2 text-sm text-red-500">
						{errors.brewery_id.message}
					</p>
				)}
			</div>
			<div>
				<textarea placeholder="Description" {...register("description")} />
				{errors.description && (
					<p className="mt-2 text-sm text-red-500">
						{errors.description.message}
					</p>
				)}
			</div>
			<div>
				<input
					type="number"
					step="1.0"
					placeholder="IBU"
					{...register("ibu", { valueAsNumber: true })}
				/>
				{errors.ibu && (
					<p className="mt-2 text-sm text-red-500">{errors.ibu.message}</p>
				)}
			</div>
			<div>
				<label htmlFor="color">Color:</label>
				<input type="text" id="color" {...register("color")} />
				{errors.color && (
					<p className="mt-2 text-sm text-red-500">{errors.color.message}</p>
				)}
			</div>
			<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Loading" : "Update"}
				</button>
		</form>
	);
}
