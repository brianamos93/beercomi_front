import { State, updateServerStore } from "@/app/actions/store";
import { Store } from "@/app/utils/def";
import { useActionState } from "react";

export default function EditStoreForm({store}: {
	store: Store;
}) {
	const initialState: State = { message: null, errors: {} };
	const updateStoreWithId = updateServerStore.bind(null, store.id)
	const [state, formAction] = useActionState(updateStoreWithId, initialState)

	return (
		<form action={formAction}>
			<div>
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					name="name"
					defaultValue={store.name}
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
					defaultValue={store.location}
				/>
				<div id="name-error" aria-live="polite" aria-atomic="true">
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
					defaultValue={store.date_of_founding}
				/>
				<div id="name-error" aria-live="polite" aria-atomic="true">
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
			<button type="submit">Edit Store</button>
		</form>
	)
}