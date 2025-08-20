'use server'

import { z } from "zod"
import { cookies } from "next/headers";
import { createBrewery, updateBrewery } from "../utils/requests/breweryRequests";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BreweryFormSchema = z.object({
	id: z.string(),
	name: z
	.string().trim()
	.min(1, { message: 'Brewery name must be at least 1 character long.'}).trim(),
	location: z.string().trim().min(5, { message: 'Brewery location must be at least 5 characters long.'}),
	date_of_founding: z.string().trim().min(4, { message: 'The date of founding must be at least 4 character long.'}),
	date_updated: z.date(),
	date_created: z.date(),
	cover_image: z.any()
})

export type State = {
	brewery?: {
		name?: string | null;
		location?: string | null;
		date_of_founding: string | null;
		cover_image: File | null;
	};
	errors?: {
		name?: string[];
		location?: string[];
		date_of_founding: string[];
		cover_iamge: string[];
	};
	message?: string | null;
}

const CreateBrewery = BreweryFormSchema.omit({ id: true, date_updated: true, date_created: true})
const UpdateBrewery = BreweryFormSchema.omit({ id: true, date_updated: true, date_created: true})

export async function createServerBrewery(prevState: State, formData: FormData) {
		const token = (await cookies()).get('token')?.value

		const validatedFields = CreateBrewery.safeParse({
			name: formData.get('name'),
			location: formData.get('location'),
			date_of_founding: formData.get('date_of_founding'),
			cover_image: formData.get('cover_image')
		})

		if (token == undefined) {
			return {
				errors: "Not Logged In"
			}
		}

		if (!validatedFields.success) {
			return {
				brewery: {
					name: formData.get('name')?.toString() ?? '',
					location: formData.get('location')?.toString() ?? '',
					date_of_founding: formData.get('date_of_founding')?.toString() ?? '',
					cover_image: formData.get('cover_image')?.toString() ?? '',
				},
				errors: validatedFields.error.flatten().fieldErrors,
				message: 'Missing Fields. Failed to Create Brewery.'
			}
		}

		try {
			await createBrewery(formData, token)
		} catch (error) {
			return {
				message: 'Datebase Error: Failed to Create Brewery.'
			}
		}

		revalidatePath('/breweries')
		redirect('/breweries')
}

export async function updateServerBrewery(
	id: string,
	prevState: State,
	formData: FormData,
) {

	const token = (await cookies()).get('token')?.value


	const validatedFields = UpdateBrewery.safeParse({
		name: formData.get('name'),
		location: formData.get('location'),
		date_of_founding: formData.get('date_of_founding'),
		cover_image: formData.get('cover_image'),
	})

	if (token == undefined) {
		return {
			errors: "Not Logged In"
		}
	}

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to update brewery.',
		}
	}
	await updateBrewery(id, formData, token)
	revalidatePath('/breweries')
	redirect('/breweries')
}