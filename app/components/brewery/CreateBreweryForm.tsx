"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { createServerBrewery } from "@/app/actions/brewery";
import {
	CreateBrewerySchema,
} from "@/app/utils/schemas/brewerySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "../form/SubmitButton";
import BreweryCommonFields from "./BreweryCommonFields";
import CoverImageField from "../beer/CoverImageField";

type FormValues = {
	cover_image?: File | null;
	name: string;
	location: string;
	date_of_founding: string;
};

export default function CreateBeerForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(CreateBrewerySchema),
		defaultValues: {},
		resetOptions: {
			keepDirtyValues: false,
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

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-xl mx-auto p-4 space-y-6 bg-white rounded-xl shadow"
		>
			{/* Cover Image */}
			<div>
				<Controller
					name="cover_image"
					control={control}
					render={({ field: { onChange, value } }) => (
						<CoverImageField
							onChange={onChange}
							onRemove={() => onChange(null)}
							previewUrl={value ? URL.createObjectURL(value) : null}
							errorMessage={errors.cover_image?.message as string}
						/>
					)}
				/>
			</div>

			<BreweryCommonFields control={control} errors={errors} />

			{/* Server Error */}
			{errors?.root && (
				<p className="text-sm text-red-500">{errors?.root?.message}</p>
			)}

			{/* Submit */}
			<SubmitButton loadingText="Saving" isSubmitting={isSubmitting}>
				Save
			</SubmitButton>
		</form>
	);
}
