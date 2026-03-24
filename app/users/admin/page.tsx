import { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理画面トップ｜テーブル選択",
  description:
    "ビール・ブルワリー・レビューなどの各種データテーブルを選択して管理できるページです。表示・編集したい項目を選んで、効率的にデータ管理を行いましょう。",
};

export default async function AdminLanding() {

	return (
		<div>
			<span>左から選択してください。</span>
		</div>
	)

}