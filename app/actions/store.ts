'use server'

import { z } from "zod"
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createStore, updateStore } from "../utils/requests/storeRequests";

const StoreFormSchema = z.object({
	id: z.string(),
	name: z
	.string().trim()
	.min(1, { message: 'Brewery name must be at least 1 character long.'}).trim(),
	location: z.string().trim().min(5, { message: 'Brewery location must be at least 5 characters long.'}),
	date_of_founding: z.string().trim().min(4, { message: 'The date of founding must be at least 4 character long.'}),
	date_updated: z.date(),
	date_created: z.date()
})

export type State = {
	store?: {
		name?: string | null;
		location?: string | null;
		date_of_founding: string | null;
	};
	errors?: {
		name?: string[];
		location?: string[];
		date_of_founding: string[];
	};
	message?: string | null;
}

const CreateStore = StoreFormSchema.omit({ id: true, date_updated: true, date_created: true})
const UpdateStore = StoreFormSchema.omit({ id: true, date_updated: true, date_created: true})

export async function createServerStore(prevState: State, formData: FormData) {
		const token = (await cookies()).get('session')?.value

		const validatedFields = CreateStore.safeParse({
			name: formData.get('name'),
			location: formData.get('location'),
			date_of_founding: formData.get('date_of_founding')
		})

		if (token == undefined) {
			return {
				errors: "Not Logged In"
			}
		}

		if (!validatedFields.success) {
			return {
				store: {
					name: formData.get('name')?.toString() ?? '',
					location: formData.get('location')?.toString() ?? '',
					date_of_founding: formData.get('date_of_founding')?.toString() ?? '',
				},
				errors: validatedFields.error.flatten().fieldErrors,
				message: 'Missing Fields. Failed to Create Brewery.'
			}
		}

		try {
			await createStore(formData, token)
		} catch (error) {
			return {
				message: 'Datebase Error: Failed to Create Store.'
			}
		}

		revalidatePath('/stores')
		redirect('/stores')
}

export async function updateServerStore(
	id: string,
	prevState: State,
	formData: FormData,
) {

	const token = (await cookies()).get('session')?.value

	const validatedFields = UpdateStore.safeParse({
		name: formData.get('name'),
		location: formData.get('location'),
		date_of_founding: formData.get('date_of_founding')
	})

	if (token == undefined) {
		return {
			errors: "Not Logged In"
		}
	}

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to update store.',
		}
	}
	await updateStore(id, formData, token)
	revalidatePath('/stores')
	redirect('/stores')
}