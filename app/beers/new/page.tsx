import CreateBeerForm from "@/app/components/beer/CreateBeerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ビールを登録",
  description: "新しいビールを登録して、名前・ブルワリー・スタイル・説明などの情報を追加できます。あなたのビール体験を共有しましょう。",
};

export default async function newBeer() {
	return <CreateBeerForm />
}