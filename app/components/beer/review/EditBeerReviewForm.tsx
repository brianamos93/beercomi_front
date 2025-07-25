'use client'

import { editServerReview, State } from "@/app/actions/review";
import { Beer, Review } from "@/app/utils/def";
import { useActionState } from "react";

export default function EditBeerReviewForm({
	beer, review,
}: {beer: Beer;
	review: Review
}) {
	const initialState: State = { message: null, errors: {} }
	const updateReviewWithId = editServerReview.bind(null, review.id)
	const [state, formAction] = useActionState(updateReviewWithId, initialState)

	const formatedRating = Number(review.rating)

	return (
		<form action={formAction}>
			<input type="hidden" name="beer_id" value={review.beer_id} />
			<div>
				<label htmlFor="review">Review:</label>
				<textarea name="review" id="review" defaultValue={review.review}></textarea>
				<div id="review-error" aria-live="polite" aria-atomic="true">
						{state?.errors?.review && state.errors.review.map((error: string) => (
							<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
						))}
					</div>
			</div>
			<div>
			<fieldset className="flex flex-row-reverse justify-center gap-1">
				
 
				<input 
					type="radio" 
					name="rating" 
					id="star5" value="5" 
					className="peer hidden" 
					defaultChecked={formatedRating === 5}
				/>
				<label htmlFor="star5" className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300">
				★
				</label>


				<input 
					type="radio" 
					name="rating" 
					id="star4" 
					value="4" 
					className="peer hidden" 
					defaultChecked={formatedRating === 4}
				/>
				<label htmlFor="star4" className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 peer-checked:~label">
				★
				</label>


				<input 
					type="radio" 
					name="rating" 
					id="star3" 
					value="3" 
					className="peer hidden" 
					defaultChecked={formatedRating === 3}
				/>
				<label htmlFor="star3" className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 peer-checked:~label">
				★
				</label>


				<input 
					type="radio" 
					name="rating" 
					id="star2" 
					value="2" 
					className="peer hidden" 
					defaultChecked={formatedRating === 2}
				/>
				<label htmlFor="star2" className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 peer-checked:~label">
				★
				</label>

			
				<input 
					type="radio" 
					name="rating" 
					id="star1" 
					value="1" 
					className="peer hidden" 
					defaultChecked={formatedRating === 1}
				/>
				<label htmlFor="star1" className="cursor-pointer text-2xl text-gray-300 peer-checked:text-yellow-400 hover:text-yellow-300 peer-checked:~label">
				★
				</label>
			</fieldset>
			<div id="rating-error" aria-live="polite" aria-atomic="true">
						{state?.errors?.rating && state.errors.rating.map((error: string) => (
							<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
						))}
					</div>
			</div>
			<div><button type="submit">Edit Review</button></div>
		</form>
	)
}