import { redirect } from "next/navigation"
import { Login } from "../../utils/requests/userRequests"

export default function loginForm() {
	return (
		<div>
			<form action={async (formData) => {
				'use server'
				await Login(formData)
				redirect('/')
			}}>
				<input type="email" name="email" id="email" placeholder="email@email.com" />
				<br />
				<input type="password" name="password" id="password" placeholder="password" />
				<br />
				<button type="submit">Login</button>
			</form>
		</div>
	)
}