"use client";

import {
	useForm,
	Controller,
	UseFormRegister,
	FieldErrors,
	Control,
} from "react-hook-form";
import { useEffect } from "react";
import { createServerBeer } from "../../actions/beer";
import { CreateBeerSchema } from "@/app/utils/schemas/beerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CoverImageField from "./CoverImageField";
import BeerCommonFields from "./BeerCommonFields";
import { BeerBaseFields } from "./BeerFormType";
import SubmitButton from "../form/SubmitButton";

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

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6"
		>
			<h2 className="text-xl font-semibold text-sky-700">Add Beer</h2>

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
