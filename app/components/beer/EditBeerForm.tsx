'use client'
import { useActionState } from "react";
import { State, updateServerBeer } from "@/app/actions/beer";
import { Beer, Brewery } from "@/app/utils/def"

export default function EditBeerForm({
	beer, breweries,
}: {
	beer: Beer;
	breweries: Brewery[];
}) {
	const initialState: State = { message: null, errors: {} };
	const updateBeerwWithId = updateServerBeer.bind(null, beer.id)
	const [state, formAction] = useActionState<State, FormData>(updateBeerwWithId, initialState)

	return (
		<form action={formAction}>
			<div>
				<input
					type="text"
					name="name"
					defaultValue={beer.name}
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
					defaultValue={beer.style}
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
					defaultValue={beer.abv}
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
					defaultValue={beer.brewery_id}
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
					defaultValue={beer.description}
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
					defaultValue={beer.ibu}
				/>
				<div id="ibu-error" aria-live="polite" aria-atomic="true">
					{state?.errors?.ibu && state.errors.ibu.map((error: string) => (
						<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
					))}
				</div>				
			</div>
			<div>
				<label htmlFor="color">Color:</label>
				<input type="text" name="color" id="color" defaultValue={beer.color} />
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
			<button type="submit">Edit Beer</button>
		</form>
	)
}