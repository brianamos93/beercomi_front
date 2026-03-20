"use client";

import {
	useForm,
	Controller,
	UseFormRegister,
	FieldErrors,
	Control,
} from "react-hook-form";
import { useEffect } from "react";
import { updateServerBeer } from "../../actions/beer";
import { Beer } from "../../utils/def";
import { EditBeerInput, EditBeerSchema } from "@/app/utils/schemas/beerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CoverImageField from "./CoverImageField";
import BeerCommonFields from "./BeerCommonFields";
import { BeerBaseFields } from "./BeerFormType";
import SubmitButton from "../form/SubmitButton";

export default function EditBeerForm({ beer }: { beer: Beer }) {
	// use undefined when there's no image so the form type matches
	const coverImageUrl = beer.cover_image ?? undefined;

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

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6"
		>
			<h2 className="text-xl font-semibold text-sky-700">Update Beer</h2>

			<Controller
				name="cover_image"
				control={control}
				render={({ field: { onChange, value } }) => {
					const previewUrl = value
						? value.type === "existing" && value.url
							? value.url
							: value.type !== "existing" && value.preview
								? value.preview
								: null
						: null;

					return (
						<CoverImageField
							onChange={(file) => {
								if (file) {
									onChange({
										file,
										preview: URL.createObjectURL(file),
										type: "new",
									});
								} else {
									onChange(null);
								}
							}}
							onRemove={() => {
								onChange(null);
								form.setValue("deleteCoverImage", true);
							}}
							previewUrl={previewUrl || null}
							errorMessage={errors.cover_image?.message as string}
						/>
					);
				}}
			/>

			<BeerCommonFields
				register={register as unknown as UseFormRegister<BeerBaseFields>}
				errors={errors as unknown as FieldErrors<BeerBaseFields>}
				control={control as unknown as Control<BeerBaseFields>}
			/>

			{/* Server Error */}
			<div id="server-error" aria-live="polite">
				{errors?.root && (
					<p className="text-red-600 text-sm">{errors.root.message}</p>
				)}
			</div>

			{/* Submit */}
			<SubmitButton loadingText="Saving" isSubmitting={isSubmitting}>Save</SubmitButton>
		</form>
	);
}
