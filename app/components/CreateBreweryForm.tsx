'use client'

import { useActionState } from "react"
import { createServerBrewery, State } from "../actions/brewery"

export default function CreateBeerForm() {
	const initialState: State = { message: null, errors: {} }

	const [state, formAction] = useActionState(createServerBrewery, initialState)

	return (
		<form action={formAction}>
			<div>
				<input
					type="text"
					name="name"
					placeholder="Name"
				/>
				<div id="name-error" aria-live="polite" aria-atomic="true">
						{state?.errors?.name && state.errors.name.map((error: string) => (
							<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
						))}
					</div>
			</div>
			<div>
				<input
					type="text"
					name="location"
					placeholder="Location"
				/>
				<div id="location-error" aria-live="polite" aria-atomic="true">
						{state?.errors?.location && state.errors.location.map((error: string) => (
							<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
						))}
				</div>
			</div>
			<div>
				<label htmlFor="date_of_founding">Date of Founding:</label>
				<input type="text" name="date_of_founding" id="date_of_founding" />
				<div id="color-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.date_of_founding && state.errors.date_of_founding.map((error: string) => (
						<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
					))}
				</div>				
			</div>

			<div aria-live="polite" aria-atomic="true">
				{state.message ? (
					<p className="mt-2 text-sm text-red-500">{state.message}</p>
				) : null}
			</div>
			<button type="submit">Submit</button>
		</form>
	)
}