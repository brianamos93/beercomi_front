import ActivityLogTable from "@/app/components/user/ActivityLogger";
import { cookies } from "next/headers";

export default async function activityTable() {
	const token = await (await cookies()).get("token")?.value;

	return (
		<div>
			<ActivityLogTable
			token={token}/>
		</div>
	)

}