"use client";

import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { createServerBeer } from "../../actions/beer";
import { Brewery } from "../../utils/def";
import {
	CreateBeerSchema,
	newCoverImageSchema,
} from "@/app/utils/schemas/beerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

type FormValues = {
	cover_image?: File | null;
	name: string;
	style: string;
	abv: number;
	brewery_id: string;
	description: string;
	ibu: number;
	color: string;
};

export default function CreateBeerForm({
	breweries,
}: {
	breweries: Brewery[];
}) {
	const [dropError, setDropError] = useState<string[]>([]);
	const form = useForm<FormValues>({
		resolver: zodResolver(CreateBeerSchema),
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
		formData.append("style", data.style);
		formData.append("abv", String(data.abv));
		formData.append("brewery_id", data.brewery_id);
		formData.append("description", data.description);
		formData.append("ibu", String(data.ibu));
		formData.append("color", data.color);

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
				<Controller
					name="brewery_id"
					control={control}
					rules={{ required: "Brewery is required" }}
					render={({ field }) => (
						<Select
							{...field}
							options={breweryOptions}
							onChange={(option) => field.onChange(option?.value)}
							value={breweryOptions.find((opt) => opt.value === field.value)}
							placeholder="Select a Brewery"
						/>
					)}
				/>
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
					{isSubmitting ? "Loading" : "Submit"}
				</button>
		</form>
	);
}
