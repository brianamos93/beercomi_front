'use server'

import { z } from "zod"
import { decrypt } from "../utils/requests/userRequests"
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
	beer: z.string(),
	author: z.string()
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

const CreateReview = ReviewFormSchema.omit({ id: true, date_updated: true, date_created: true, author: true })
const UpdateReview = ReviewFormSchema.omit({ id: true, date_updated: true, date_created: true, author: true })

export async function createServerReview(prevState: State, formData: FormData) {
	let session = null
		const cookie = (await cookies()).get('session')?.value
		if(cookie) {
			const decryptedCookie = await decrypt(cookie)
			session = decryptedCookie.token
		}

		const validatedFields = CreateReview.safeParse({
			beer: formData.get('beer'),
			review: formData.get('review'),
			rating: formData.get('rating')
		})

		if (session == undefined) {
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
			await createReview(formData, session)
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
	let session = null
	const cookie = (await cookies()).get('session')?.value
	if(cookie) {
		const decryptedCookie = await decrypt(cookie)
		session = decryptedCookie.token
	}

	const validatedFields = UpdateReview.safeParse({
		beer: formData.get('beer'),
		review: formData.get('review'),
		rating: formData.get('rating')
	})

	if (session == undefined) {
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
		await editReview(id, formData, session)
	} catch (error) {
		return {
			message: 'Database Error: Failed to Edit Review.'
		}
		
	}
	
	revalidatePath('/beers')
	redirect(`/beers/${formData.get('beer')}`)
}