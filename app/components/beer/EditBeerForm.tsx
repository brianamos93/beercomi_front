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
	}, [beer.id, beer.name, beer.style, beer.abv, beer.brewery_id, beer.color, beer.ibu, beer.description, coverImageUrl, reset, beer.brewery_name]);

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
											r.errors.map((e) => errorMessages[e.code] || e.message),
										);
										setDropError(customErrors);
										return;
									}

									// Zod validation for accepted file
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
							/>
						)}
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
