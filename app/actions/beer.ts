'use server'

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers";
import { createBeer, updateBeer } from "../utils//requests/beerRequests";
import { z } from 'zod'
import { redirect } from "next/navigation";

const BeerFormSchema = z.object({
	id: z.string(),
	name: z
	.string().trim()
	.min(1, { message: 'Name must be at least 1 character long.'}).trim(),
	style: z.string().trim(),
	abv: z.coerce.number(),
	brewery_id: z.string({message: 'You must select a brewery.'}),
	description: z.string().trim().min(10, { message: 'Description must contain at least 10 characters.'}),
	ibu: z.coerce.number(),
	color: z.string(),
	date_updated: z.date(),
	date_created: z.date(),
	cover_image: z.any()
	
})

export type State = {
	beer?:{
		name?: string | null;
		style?: string | null;
		abv?: number | null;
		brewery_id?: string | null;
		description?: string | null;
		ibu?: number | null;
		color?: string | null;
		cover_image?: File | null;
	}
  errors?: {
    name?: string[];
    style?: string[];
    abv?: string[];
	brewery_id?: string[];
	description?: string[];
	ibu?: string[];
	color?: string[];
	cover_image?: string[];
  };
  message?: string | null;
};


const CreateBeer = BeerFormSchema.omit({ id: true, date_updated: true, date_created: true})
const UpdateBeer = BeerFormSchema.omit({ id: true, date_updated: true, date_created: true})

export async function createServerBeer(prevState: State, formData: FormData) {

	const token = (await cookies()).get('token')?.value

	const validatedFields = CreateBeer.safeParse({
		name: formData.get('name'),
		style: formData.get('style'),
		abv: formData.get('abv'),
		brewery_id: formData.get('brewery_id'),
		description: formData.get('description'),
		ibu: formData.get('ibu'),
		color: formData.get('color'),
		cover_iamge: formData.get('cover_image')
	})


	if (token == undefined) {
		return {
			errors: "Not Logged In"
		}
	}

	if (!validatedFields.success) {
		return {
			beer: {
			name: formData.get('name')?.toString() ?? '',
			style: formData.get('style')?.toString() ?? '',
			abv: Number(formData.get('abv')),
			brewery_id: formData.get('brewery_id')?.toString() ?? '',
			description: formData.get('description')?.toString() ?? '',
			ibu: Number(formData.get('ibu')),
			color: formData.get('color')?.toString() ?? '',
			cover_image: formData.get('cover_image')?.toString() ?? ''
		},
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Beer.',
		}
	}
	try {
		await createBeer(formData, token)
	} catch (error) {
		return {
			message: 'Database Error: Failed to Create Beer.'
		}
		
	}
	
	revalidatePath('/beers')
	redirect('/beers')
}

export async function updateServerBeer(
	id: string,
	prevState: State,
	formData: FormData,
) {

	const token = (await cookies()).get('session')?.value

	
	const validatedFields = UpdateBeer.safeParse({
		name: formData.get('name'),
		style: formData.get('style'),
		abv: formData.get('abv'),
		brewery_id: formData.get('brewery_id'),
		description: formData.get('description'),
		ibu: formData.get('ibu'),
		color: formData.get('color'),
		cover_image: formData.get('cover_image')
	})


	if (token == undefined) {
		return {
			errors: "Not Logged In"
		}
	}

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to update beer.',
		}
	}

	try {
		await updateBeer(id, formData, token)
	} catch (error) {
		return {
			message: 'Database Error: Failed to update beer.'
		}	
		
	}
	revalidatePath('/beers')
	redirect('/beers')
}