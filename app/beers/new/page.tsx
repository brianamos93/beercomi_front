import { createServerBeer } from "@/app/actions/beer";
import BeerForm from "@/app/components/BeerForm";


export default function newBeer() {
	return <BeerForm action={createServerBeer} />
}