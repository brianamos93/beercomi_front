import BreweryTable from "@/app/components/interface/admin/BreweryTable"
import { requireToken } from "@/app/utils/libs/token"
import { Metadata } from "next";
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "ブルワリー管理一覧｜醸造所データ管理",
  description:
    "登録されているブルワリー（醸造所）の情報を一覧で確認・管理できる管理画面です。名称や所在地などの情報をチェックし、編集・削除などの操作を行えます。",
};

export default async function breweryTable() {
	const token = requireToken(await ((await cookies()).get("token")?.value))

	return (
		<div>
			<BreweryTable token={token} />
		</div>
	)
}