"use client";

import { useForm, Controller, Control, FieldErrors } from "react-hook-form";
import { useEffect } from "react";
import { updateServerBrewery } from "../../actions/brewery";
import {
	EditBreweryInput,
	EditBrewerySchema,
} from "@/app/utils/schemas/brewerySchema";
import { Brewery } from "../../utils/def";
import { zodResolver } from "@hookform/resolvers/zod";
import url from "@/app/utils/utils";
import SubmitButton from "../form/SubmitButton";
import BreweryCommonFields from "./BreweryCommonFields";
import CoverImageField from "../beer/CoverImageField";
import { BreweryBaseFields } from "./BreweryFormType";

export default function EditBreweryForm({ brewery }: { brewery: Brewery }) {
	let coverImageUrl;
	if (!brewery.cover_image) {
		coverImageUrl = undefined;
	} else {
		coverImageUrl = url + brewery.cover_image;
	}
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

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow"
		>
			{/* Cover Image */}
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

			<BreweryCommonFields
				control={control as unknown as Control<BreweryBaseFields>}
				errors={errors as unknown as FieldErrors<BreweryBaseFields>}
			/>

			{/* Server Error */}
			{errors?.root && (
				<p className="text-sm text-red-500">{errors?.root?.message}</p>
			)}

			{/* Submit */}
			<SubmitButton loadingText="保存中…" isSubmitting={isSubmitting}>
				保存
			</SubmitButton>
		</form>
	);
}
