'use client'
import { signup } from "@/app/actions/auth"
import { useActionState } from "react"

export default function SignupForm() {
	const [state, action, pending] = useActionState(signup, undefined)
	return (
		<div>
			<form action={action}>
				<input type="text" name="display_name" id="display_name" placeholder="Display Name" />
				{state?.errors?.display_name && <p>{state.errors.display_name}</p>}
				<br />
				<input type="email" name="email" id="email" placeholder="emal@email.com" />
				{state?.errors?.email && <p>{state.errors.email}</p>}
				<br />
				<input type="password" name="password" id="password" placeholder="password" />
				{state?.errors?.password && (
        			<div>
          				<p>Password must:</p>
          				<ul>
            				{state.errors.password.map((error) => (
              					<li key={error}>- {error}</li>
            					))}
          				</ul>
        			</div>
      			)}
				<button type="submit">Signup</button>
			</form>
		</div>
	)
}