'use client'

import { useActionState } from "react"
import { uploadAvatarServer, State } from "@/app/actions/avatar"

export default function UploadAvatarForm() {
	const initialState: State = { message: null, errors: {} }
	
	const [state, formAction] = useActionState<State, FormData>(uploadAvatarServer, initialState)

	return (
		<form action={formAction}>
			<div>
				<input type="file" name="image" id="image" />
				<div id="file-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.file && state.errors.file.map((error: string) => (
							<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
						))}
				</div>
			</div>
			<div>
				<div aria-live="polite" aria-atomic="true">
          		{state.message ? (
            		<p className="mt-2 text-sm text-red-500">{state.message}</p>
          		) : null}
        	</div>
				<button type="submit">Submit</button>
			</div>
		</form>
	)
}