import BeerTable from "@/app/components/interface/admin/BeerTable"
import { requireToken } from "@/app/utils/libs/token"
import { cookies } from "next/headers"

export default async function beerTable() {
	const token = requireToken(await ((await cookies()).get("token")?.value))

	return (
		<div>
			<BeerTable token={token} />
		</div>
	)
}