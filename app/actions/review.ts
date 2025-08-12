'use server'

import { z } from "zod"
import { cookies } from "next/headers"
import { createReview, editReview } from "../utils/requests/reviewRequests"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const ReviewFormSchema = z.object({
	id: z.string(),
	review: z.string()
	.trim()
	.min(10, {message: 'Review must be at least 10 character long.'}),
	rating: z.coerce.number(),
	date_updated: z.date(),
	date_created: z.date(),
	beer_id: z.string(),
	author_id: z.string()
})

export type State = {
	review?:{
		review?: string | null;
		rating?: number | null;
	}
	errors?: {
		review?: string[];
		rating?: string[];
	}
	message?: string | null;
	}

const CreateReview = ReviewFormSchema.omit({ id: true, date_updated: true, date_created: true, author_id: true })
const UpdateReview = ReviewFormSchema.omit({ id: true, date_updated: true, date_created: true, author_id: true })

export async function createServerReview(prevState: State, formData: FormData) {
		const token = (await cookies()).get('token')?.value

		const validatedFields = CreateReview.safeParse({
			beer_id: formData.get('beer_id'),
			review: formData.get('review'),
			rating: formData.get('rating')
		})

		if (token == undefined) {
			return {
				errors: "Not Logged In"
			}
		}

		if (!validatedFields.success) {
			return {
				review: {
					review: formData.get('review')?.toString() ?? '',
					rating: Number(formData.get('rating')) ?? '',
				},
				errors: validatedFields.error.flatten().fieldErrors,
				message: 'Missing Fields. Failed to Create Review.'
			}
		}
		try {
			await createReview(formData, token)
		} catch (error) {
			return {
				message: 'Database Error: Failed to Create Review.'
			}
		}
		revalidatePath('/beers')
		redirect(`/beers/${formData.get('beer')}`)
}

export async function editServerReview(
	id: string, 
	prevState: State, 
	formData: FormData,
) {

	const token = (await cookies()).get('token')?.value


	const validatedFields = UpdateReview.safeParse({
		beer_id: formData.get('beer_id'),
		review: formData.get('review'),
		rating: formData.get('rating')
	})

	if (token == undefined) {
		return {
			errors: "Not Logged In"
		}
	}

	if (!validatedFields.success) {
		return {
			review: {
				review: formData.get('review')?.toString() ?? '',
				rating: Number(formData.get('rating')) ?? ''
			},
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Edit Review.'
		}
	}
	try {
		await editReview(id, formData, token)
	} catch (error) {
		return {
			message: 'Database Error: Failed to Edit Review.'
		}
		
	}
	
	revalidatePath('/beers')
	redirect(`/beers/${formData.get('beer_id')}`)
}