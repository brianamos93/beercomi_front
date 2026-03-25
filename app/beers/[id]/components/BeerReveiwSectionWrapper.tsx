import { useAuth } from "@/app/components/AuthProvider";
import BeerReviewsSection from "./BeerReviewsSection";
import { Beer } from "@/app/utils/def";

export default function BeerReviewSectionWrapper({beer, page}: {beer: Beer, page: number}) {
	const { user } = useAuth();
	if (!user) return <BeerReviewsSection beerId={beer.id} userId={null} initialPage={page}/>
	return (
			<BeerReviewsSection beerId={beer.id} userId={user.id} initialPage={page}/>
	);
}