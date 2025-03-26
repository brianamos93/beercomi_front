'use client'
import { signup } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import { useActionState } from "react"

export default function signupForm() {
	return (
		<div>
			<form action={async (formData) => {
				'use server'
				await signup(formData)
				redirect('/login')
			}}>
				<input type="text" name="display_name" id="display_name" placeholder="Display Name" />
				<br />
				<input type="email" name="email" id="email" placeholder="emal@email.com" />
				<br />
				<input type="password" name="password" id="password" placeholder="password" />
				<button type="submit">Signup</button>
			</form>
		</div>
	)
}