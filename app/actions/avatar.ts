'use server'

import { cookies } from "next/headers";
import { z } from "zod"
import { uploadAvatar } from "../utils/requests/profileRequests";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const AvatarFormSchema = z.object({
	id: z.string(),
	image: z.any()
		//.refine((file) => file.size > 0, 'File must not be empty')
		//.refine((file) => file.size <= MAX_FILE_SIZE, 'File must be under 5MB')
		//.refine((file) => ['image/jpeg', 'image/png'].includes(file.type), 'Only JPEG and PNG allowed')
})

export type State = {
	avatar?:{
		file?: File | null;
	}
	errors?: {
		file?: string[]
	}
	message?: string | null;
}

const UploadAvatar = AvatarFormSchema.omit({ id: true })

export async function uploadAvatarServer(prevState: State, formData: FormData) {
		const token = (await cookies()).get('token')?.value

		const validatedFields = UploadAvatar.safeParse({
			file: formData.get('avatar')
		})

		if (token == undefined) {
			return {
				errors: "Not Logged In"
			}
		}

		if (!validatedFields.success) {
			return {
				avatar: {
					file: formData.get('image')?.toString() ?? ''
				},
				errors: validatedFields.error.flatten().fieldErrors,
				message: 'Failed to upload avatar'
			}
		}
		try {
			await uploadAvatar(formData, token)
		} catch (error) {
			return {
				message: 'Database Error: Failed to Uplaod Avatar.'
			}
		}
		revalidatePath("/users/profile")
		redirect("/users/profile")
}