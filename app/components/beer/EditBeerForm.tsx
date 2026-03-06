"use client";

import { useForm, Controller } from "react-hook-form";
import { GroupBase, OptionsOrGroups } from "react-select";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { updateServerBeer } from "../../actions/beer";
import { Beer, Brewery } from "../../utils/def";
import {
	EditBeerInput,
	EditBeerSchema,
	newCoverImageSchema,
} from "@/app/utils/schemas/beerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { getBreweries } from "@/app/utils/requests/breweryRequests";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";

export default function EditBeerForm({ beer }: { beer: Beer }) {
	// use undefined when there's no image so the form type matches
	const coverImageUrl = beer.cover_image ?? undefined;
	const [dropError, setDropError] = useState<string[]>([]);
	const [hasMounted, setHasMounted] = useState(false);
	const form = useForm<EditBeerInput>({
		resolver: zodResolver(EditBeerSchema),
		defaultValues: {
			name: beer.name,
			style: beer.style,
			abv: beer.abv,
			brewery_id: {
				label: beer.brewery_name,
				value: beer.brewery_id,
			},
			color: beer.color,
			ibu: beer.ibu,
			description: beer.description,
			cover_image: coverImageUrl
				? { url: coverImageUrl, type: "existing" as const }
				: null,
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
		const id = setTimeout(() => setHasMounted(true), 0);
		return () => clearTimeout(id);
	}, []);

	useEffect(() => {
		reset({
			name: beer.name,
			style: beer.style,
			abv: beer.abv,
			brewery_id: {
				label: beer.brewery_name,
				value: beer.brewery_id,
			},
			color: beer.color,
			ibu: beer.ibu,
			description: beer.description,
			cover_image: coverImageUrl
				? { url: coverImageUrl, type: "existing" as const }
				: null,
			deleteCoverImage: false,
		});
	}, [
		beer.id,
		beer.name,
		beer.style,
		beer.abv,
		beer.brewery_id,
		beer.color,
		beer.ibu,
		beer.description,
		coverImageUrl,
		reset,
		beer.brewery_name,
	]);

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
		formData.append("brewery_id", data.brewery_id?.value ?? "");
		formData.append("description", data.description);
		formData.append("ibu", String(data.ibu));
		formData.append("color", data.color);

		// Always send deleteCoverImage (as "true" or "false")
		formData.append("deleteCoverImage", String(data.deleteCoverImage));

		const res = await updateServerBeer(beer.id, formData);

		if (res.error) {
			setError("root", { type: "server", message: res.error });
		}
	};

	const errorMessages: Record<string, string> = {
		"file-too-large": "This file exceeds the 1 MB limit.",
		"file-invalid-type": "Only image files are allowed.",
	};

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
			<h2 className="text-xl font-semibold text-sky-700">Update Beer</h2>

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
										className="p-6 border-2 border-dashed border-sky-400 rounded-lg text-center cursor-pointer bg-sky-50 hover:bg-sky-100 transition"
									>
										<input
											{...getInputProps()}
											aria-label="Upload cover image"
										/>

										<p className="text-sm text-sky-700">
											Drag & drop a cover image or tap to upload
										</p>

										<p className="text-xs text-gray-500 mt-1">
											Max file size 1MB
										</p>
									</div>
								)}
							</Dropzone>

							{value &&
								((value.type === "existing" && value.url) ||
									(value.type !== "existing" && value.preview)) && (
									<div className="mt-3 relative w-fit">
										<Image
											src={
												value.type === "existing" ? value.url : value.preview
											}
											alt="Uploaded cover image"
											width={150}
											height={150}
											className="rounded-lg object-cover border"
										/>

										<button
											type="button"
											className="absolute top-1 right-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full w-7 h-7 flex items-center justify-center"
											onClick={() => {
												onChange(null);
												form.setValue("deleteCoverImage", true);
											}}
											aria-label="Remove cover image"
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
					Name
				</label>

				<input
					id="name"
					type="text"
					{...register("name", { required: "Name is required" })}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
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

				{errors.abv && (
					<p className="text-red-600 text-sm mt-2">{errors.abv.message}</p>
				)}
			</div>

			{/* Brewery */}
			<div>
				<label className="block text-sm font-medium text-sky-800 mb-2">
					Brewery
				</label>

				{hasMounted && (
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
								isSearchable={true}
								placeholder="Search breweries..."
								menuPortalTarget={document.body}
								menuPosition="fixed"
							/>
						)}
					/>
				)}

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

				{errors.description && (
					<p className="text-red-600 text-sm mt-2">
						{errors.description.message}
					</p>
				)}
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

				{errors.ibu && (
					<p className="text-red-600 text-sm mt-2">{errors.ibu.message}</p>
				)}
			</div>

			{/* Color */}
			<div>
				<label
					htmlFor="color"
					className="block text-sm font-medium text-sky-800"
				>
					Color
				</label>

				<input
					id="color"
					type="text"
					{...register("color")}
					className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-sky-500"
				/>

				{errors.color && (
					<p className="text-red-600 text-sm mt-2">{errors.color.message}</p>
				)}
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
				className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
			>
				{isSubmitting ? "Loading..." : "Update"}
			</button>
		</form>
	);
}
