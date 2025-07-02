'use server'

import { z } from "zod"
import { cookies } from "next/headers";
import { decrypt } from "../utils/requests/userRequests";
import { createBrewery } from "../utils/requests/breweryRequests";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateBeer } from "../utils/requests/beerRequests";

const BreweryFormSchema = z.object({
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
	errors?: {
		name?: string[];
		location?: string[];
		date_of_founding: string[];
	};
	message?: string | null;
}

const CreateBrewery = BreweryFormSchema.omit({ id: true, date_updated: true, date_created: true})
const UpdateBrewery = BreweryFormSchema.omit({ id: true, date_updated: true, date_created: true})

export async function createServerBrewery(prevState: State, formData: FormData) {
		let session = null
		const cookie = (await cookies()).get('session')?.value
		if(cookie) {
			const decryptedCookie = await decrypt(cookie)
			session = decryptedCookie.token
		}
		const validatedFields = CreateBrewery.safeParse({
			name: formData.get('name'),
			location: formData.get('location'),
			date_of_founding: formData.get('date_of_founding')
		})

		if (session == undefined) {
			return {
				errors: "Not Logged In"
			}
		}

		if (!validatedFields.success) {
			return {
				errors: validatedFields.error.flatten().fieldErrors,
				message: 'Missing Fields. Failed to Create Brewery.'
			}
		}

		try {
			await createBrewery(formData, session)
		} catch (error) {
			return {
				message: 'Datebase Error: Failed to Create Brewery.'
			}
		}

		revalidatePath('/breweries')
		redirect('/breweries')
}

export async function updateServerBrewery(id: string,
	prevState: State,
	formData: FormData,
) {
	let session = null
	const cookie = (await cookies()).get('session')?.value
	if(cookie) {
		const decryptedCookie = await decrypt(cookie)
		session = decryptedCookie.token
	}

	const validatedFields = UpdateBrewery.safeParse({
		name: formData.get('name'),
		location: formData.get('location'),
		date_of_founding: formData.get('date_of_founding')
	})

	if (session == undefined) {
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
	await updateBeer(id, formData, session)
	revalidatePath('/beers')
	redirect('/beers')
}