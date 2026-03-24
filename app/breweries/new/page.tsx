import CreateBreweryForm from "@/app/components/brewery/CreateBreweryForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ブルワリーを登録",
  description: "新しいブルワリーを登録して、名前・住所・創立などの情報を追加できます。あなたのビール体験を共有しましょう。",
};

export default async function newBrewery() {
	return <CreateBreweryForm />
}