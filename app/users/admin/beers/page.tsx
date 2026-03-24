import BeerTable from "@/app/components/interface/admin/BeerTable"
import { requireToken } from "@/app/utils/libs/token"
import { Metadata } from "next";
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "ビール管理一覧｜ビール情報の管理",
  description:
    "登録されているビールの情報を一覧で確認・管理できるページです。名前やスタイル、アルコール度数などの詳細をチェックし、編集・削除などの操作を行えます。",
};

export default async function beerTable() {
	const token = requireToken(await ((await cookies()).get("token")?.value))

	return (
		<div>
			<BeerTable token={token} />
		</div>
	)
}