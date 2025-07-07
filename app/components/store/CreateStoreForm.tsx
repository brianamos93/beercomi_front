'use client'

import { createServerStore, State } from "@/app/actions/store"
import { useActionState } from "react"

export default function CreateBeerForm() {
	const initialState: State = { message: null, errors: {} }

	const [state, formAction] = useActionState(createServerStore, initialState)

	return (
		<form action={formAction}>
			<div>
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					name="name"
					placeholder="Name"
					defaultValue={state?.store?.name ?? ""}
				/>
				<div id="name-error" aria-live="polite" aria-atomic="true">
						{state?.errors?.name && state.errors.name.map((error: string) => (
							<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
						))}
					</div>
			</div>
			<div>
				<label htmlFor="location">Location:</label>
				<input
					type="text"
					name="location"
					placeholder="Location"
					defaultValue={state?.store?.location ?? ""}
				/>
				<div id="location-error" aria-live="polite" aria-atomic="true">
						{state?.errors?.location && state.errors.location.map((error: string) => (
							<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
						))}
				</div>
			</div>
			<div>
				<label htmlFor="date_of_founding">Date of Founding:</label>
				<input 
				type="text" 
				name="date_of_founding" 
				id="date_of_founding"
				placeholder="Date of Founding"
				defaultValue={state?.store?.date_of_founding ?? ""} 
				/>
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