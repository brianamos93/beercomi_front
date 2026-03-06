"use client";

import { useForm, Controller } from "react-hook-form";
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
import { getBreweries } from "@/app/utils/requests/breweryRequests";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { GroupBase, OptionsOrGroups } from "react-select";

type FormValues = {
	cover_image?: File | null;
	name: string;
	style: string;
	abv: number;
	brewery_id: {
		label: string;
		value: string;
	};
	description: string;
	ibu: number;
	color: string;
};

export default function CreateBeerForm() {
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

		formData.append("brewery_id", data.brewery_id?.value ?? "");

		formData.append("description", data.description);
		formData.append("ibu", String(data.ibu));
		formData.append("color", data.color);

		const res = await createServerBeer(formData);

		if (res.error) {
			setError("root", { type: "server", message: res.error });
		}
	};

	const errorMessages: Record<string, string> = {
		"file-too-large": "This file exceeds the 1 MB limit.",
		"file-invalid-type": "Only image files are allowed.",
	};

	//brewery form
	type BreweryOption = {
		value: string;
		label: string;
	};

	type Additional = {
		offset: number;
	};

	const loadOptions: LoadOptions<
		BreweryOption,
		GroupBase<BreweryOption>,
		Additional
	> = async (
		search: string,
		loadedOptions: OptionsOrGroups<BreweryOption, GroupBase<BreweryOption>>,
		additional?: Additional,
	) => {
		const offset = additional?.offset ?? 0;
		const res = await getBreweries({ limit: 20, offset: offset, q: search });

		return {
			options: res.data.map((brewery: Brewery) => ({
				value: brewery.id,
				label: brewery.name,
			})),
			hasMore:
				res.pagination.offset + res.pagination.limit < res.pagination.total,
			additional: {
				offset: res.pagination.offset + res.pagination.limit,
			},
		};
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6"
		>
			<h2 className="text-xl font-semibold text-sky-700">Add Beer</h2>

			{/* Cover Image */}
			<div>
				<label className="block text-sm font-medium text-sky-800 mb-2">
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
										className="p-6 border-2 border-dashed border-sky-400 rounded-lg text-center cursor-pointer bg-sky-50 hover:bg-sky-100 transition"
									>
										<input
											{...getInputProps()}
											aria-label="Upload cover image"
										/>
										<p className="text-sm text-sky-700">
											Drag & drop an image or tap to select
										</p>
										<p className="text-xs text-gray-500 mt-1">Max size 1MB</p>
									</div>
								)}
							</Dropzone>

							{value && (
								<div className="mt-3 relative w-fit">
									<Image
										src={URL.createObjectURL(value)}
										alt={value.name}
										width={150}
										height={150}
										className="rounded-lg object-cover border"
										onLoad={(e) => {
											URL.revokeObjectURL((e.target as HTMLImageElement).src);
										}}
									/>

									<button
										type="button"
										onClick={() => onChange(null)}
										className="absolute top-1 right-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full w-7 h-7 flex items-center justify-center"
										aria-label="Remove image"
									>
										✕
									</button>
								</div>
							)}

							{dropError.length > 0 && (
								<ul className="text-red-600 text-sm mt-2">
									{dropError.map((err, idx) => (
										<li key={idx}>{err}</li>
									))}
								</ul>
							)}
						</div>
					)}
				/>

				{errors.cover_image && (
					<p className="text-red-600 text-sm mt-2">
						{errors.cover_image.message as string}
					</p>
				)}
			</div>

			{/* Name */}
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-sky-800"
				>
					Beer Name
				</label>

				<input
					id="name"
					type="text"
					{...register("name", { required: "Name is required" })}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
				/>

				{errors.name && (
					<p className="text-red-600 text-sm mt-2">{errors.name.message}</p>
				)}
			</div>

			{/* Style */}
			<div>
				<label
					htmlFor="style"
					className="block text-sm font-medium text-sky-800"
				>
					Style
				</label>

				<input
					id="style"
					type="text"
					{...register("style")}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500"
				/>
			</div>

			{/* ABV */}
			<div>
				<label htmlFor="abv" className="block text-sm font-medium text-sky-800">
					ABV (%)
				</label>

				<input
					id="abv"
					type="number"
					step="0.1"
					{...register("abv", { valueAsNumber: true })}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500"
				/>
			</div>

			{/* Brewery Select */}
			<div>
				<label className="block text-sm font-medium text-sky-800 mb-2">
					Brewery
				</label>

				<Controller
					name="brewery_id"
					control={control}
					rules={{ required: "Brewery is required" }}
					render={({ field: { onChange, value, ref } }) => (
						<AsyncPaginate
							instanceId="brewery-select"
							value={value}
							selectRef={ref}
							loadOptions={loadOptions}
							getOptionValue={(option: BreweryOption) => option.value}
							getOptionLabel={(option: BreweryOption) => option.label}
							onChange={onChange}
							additional={{ offset: 0 }}
							debounceTimeout={300}
							isSearchable
							placeholder="Search breweries..."
						/>
					)}
				/>

				{errors.brewery_id && (
					<p className="text-red-600 text-sm mt-2">
						{errors.brewery_id.message}
					</p>
				)}
			</div>

			{/* Description */}
			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-sky-800"
				>
					Description
				</label>

				<textarea
					id="description"
					rows={4}
					{...register("description")}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500"
				/>
			</div>

			{/* IBU */}
			<div>
				<label htmlFor="ibu" className="block text-sm font-medium text-sky-800">
					IBU
				</label>

				<input
					id="ibu"
					type="number"
					step="1"
					{...register("ibu", { valueAsNumber: true })}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500"
				/>
			</div>

			{/* Color */}
			<div>
				<label
					htmlFor="color"
					className="block text-sm font-medium text-sky-800"
				>
					Beer Color
				</label>

				<input
					id="color"
					type="text"
					{...register("color")}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500"
				/>
			</div>

			{/* Server Error */}
			<div id="server-error" aria-live="polite">
				{errors?.root && (
					<p className="text-red-600 text-sm">{errors.root.message}</p>
				)}
			</div>

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
