'use server'

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers";
import { BeerFormSchema, BeerFormState } from "../utils/def";
import { createBeer } from "../utils/beerRequests";

export async function createServerBeer(state: BeerFormState, formData: FormData) {
	const token = (await cookies()).get('session')?.value;
	const validatedFields = BeerFormSchema.safeParse({
		name: formData.get('name'),
		type: formData.get('type'),
		abv: formData.get('abv'),
		brewery: formData.get('brewery'),
		description: formData.get('description'),
		ibu: formData.get('ibu')
	})

	if (token == undefined) {
		return {
			errors: "Not Logged In"
		}
	}

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}
	await createBeer(formData, token)
	revalidatePath('/beers')
}