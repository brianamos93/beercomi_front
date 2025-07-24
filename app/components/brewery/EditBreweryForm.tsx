'use client'

import { useActionState } from "react"
import { State, updateServerBrewery } from "../../actions/brewery"
import { Brewery } from "../../utils/def"

export default function EditBreweryForm({
	brewery,
}: {
	brewery: Brewery;
}) {
	const initialState: State = { message: null, errors: {} }
	const updateBreweryWithId = updateServerBrewery.bind(null, brewery.id)
	const [state, formAction] = useActionState(updateBreweryWithId, initialState)

	return (
		<form action={formAction}>
			<div>
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					name="name"
					placeholder="Name"
					defaultValue={brewery.name}
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
					defaultValue={brewery.location}
				/>
				<div id="location-error" aria-live="polite" aria-atomic="true">
						{state?.errors?.location && state.errors.location.map((error: string) => (
							<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
						))}
				</div>
			</div>
			<div>
				<label htmlFor="date_of_founding">Date of Founding:</label>
				<input type="text" name="date_of_founding" id="date_of_founding" defaultValue={brewery.date_of_founding} />
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
			<button type="submit">Edit Brewery</button>
		</form>
	)
}