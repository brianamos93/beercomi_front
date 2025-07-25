import { redirect } from 'next/navigation'
import { SignupFormSchema, SignupFormState } from '../utils/def'
import { Signup } from '../utils/signup'
 
export async function signup(state: SignupFormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    display_name: formData.get('display_name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  await Signup(formData)
  redirect("/users/login")
}