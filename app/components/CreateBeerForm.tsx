'use client'

import { useActionState } from "react"
import { createServerBeer, State } from "../actions/beer"
import { Brewery } from "../utils/def"

export default function CreateBeerForm({ breweries }: { breweries: Brewery[] }) {
	const initialState: State = { message: null, errors: {} }

	const [state, formAction] = useActionState(createServerBeer, initialState)

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
					name="style"
					placeholder="Style"
				/>
				<div id="style-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.style && state.errors.style.map((error: string) => (
						<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
					))}
				</div>
			</div>
			<div>
				<input
					type="number"
					name="abv"
					step="0.1"
					aria-describedby="abv-error"
					placeholder="ABV"
				/>
				<div id="abv-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.abv && state.errors.abv.map((error: string) => (
						<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
					))}
				</div>
			</div>
			<div>
				<select
					name="brewery_id"
				>
					<option value="" disabled>
						Select a Brewery
					</option>
					{breweries.map((brewery) => (
						<option key={brewery.id} value={brewery.id}>
							{brewery.name}
						</option>
					))}
				</select>
				<div id="brewery-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.brewery_id && state.errors.brewery_id.map((error: string) => (
						<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
					))}
				</div>
			</div>
			<div>
				
			</div>
			<div>
				<textarea
					name="description"
					placeholder="Description"
				/>
				<div id="description-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.description && state.errors.description.map((error: string) => (
						<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
					))}
				</div>
			</div>
			<div>
				<input
					type="number"
					step="1.0"
					name="ibu"
					placeholder="IBU"
				/>
				<div id="ibu-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.ibu && state.errors.ibu.map((error: string) => (
						<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
					))}
				</div>				
			</div>
			<div>
				<label htmlFor="color">Color:</label>
				<input type="text" name="color" id="color" />
				<div id="color-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.color && state.errors.color.map((error: string) => (
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