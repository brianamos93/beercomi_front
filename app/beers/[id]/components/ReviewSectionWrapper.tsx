import { getReviewConfirm } from "@/app/utils/requests/reviewRequests";
import { cookies } from "next/headers";
import BeerReviewsSection from "./BeerReviewsSection";

export default async function ReviewSectionWrapper({beerId, initialPage}: {beerId: string, initialPage: number}) {
	let hasReviewed = false
	const token = (await cookies()).get("token")?.value;
	if(token) {
		const res = getReviewConfirm({id: beerId, token: token})
		hasReviewed = (await res).reviewed
	}
	

	return (
		<BeerReviewsSection beerId={beerId} initialPage={initialPage} hasReviewed={hasReviewed}/>
	)
}