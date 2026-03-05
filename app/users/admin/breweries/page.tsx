import BreweryTable from "@/app/components/interface/admin/BreweryTable"
import { requireToken } from "@/app/utils/libs/token"
import { cookies } from "next/headers"

export default async function beerTable() {
	const token = requireToken(await ((await cookies()).get("token")?.value))

	return (
		<div>
			<BreweryTable token={token} />
		</div>
	)
}