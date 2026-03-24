import ReviewTable from "@/app/components/interface/admin/ReviewTable"
import { requireToken } from "@/app/utils/libs/token"
import { Metadata } from "next";
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "レビュー管理｜一覧・編集",
  description:
    "投稿されたビールレビューを一覧で確認・管理できるページです。評価やコメントの内容をチェックし、必要に応じて編集・削除を行えます。",
};

export default async function reviewsTable() {
	const token = requireToken(await ((await cookies()).get("token")?.value))

	return (
		<div>
			<ReviewTable token={token} />
		</div>
	)
}