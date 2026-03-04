import BeerTable from "@/app/components/interface/admin/BeerTable"
import { cookies } from "next/headers"

export default async function beerTable() {
	const token = await ((await cookies()).get("token")?.value)

	return (
		<div>
			<BeerTable token={token} />
		</div>
	)
}