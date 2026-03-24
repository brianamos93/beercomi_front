import ActivityLogTable from "@/app/components/user/ActivityLogger";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "アクティビティ履歴｜ユーザー操作の一覧",
  description:
    "ユーザーによる最近の操作履歴を一覧で確認できるページです。レビュー投稿や編集、削除などのアクションを時系列でチェックできます。",
};

export default async function activityTable() {
	const token = await (await cookies()).get("token")?.value;

	return (
		<div>
			<ActivityLogTable
			token={token}/>
		</div>
	)

}