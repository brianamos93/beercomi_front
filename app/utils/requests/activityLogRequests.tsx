import { ActivityLogResponse } from "../def";
import url from "../utils";

export const getActivityLog = async ({
	token,
	limit,
	offset,
}: {
	token: string | undefined;
	limit: number;
	offset: number;
}): Promise<ActivityLogResponse> => {
	const res = await fetch(
		`${url}/admin/activitylog?limit=${limit}&offset=${offset}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		}
	);
	if (!res.ok) throw new Error("Failed to fetch activity");
	return res.json();
};
