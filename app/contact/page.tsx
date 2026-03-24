import { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "本サイトへのご質問・ご意見・ご要望などは、メールよりお気軽にお問い合わせください。",
};

export default async function ContactPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
			<div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full">
				<h1 className="text-2xl font-bold text-center mb-6">お問い合わせ</h1>

				<div className="space-y-4 text-center">
					<div>
						<p className="text-gray-500 text-sm">名前</p>
						<p className="font-medium text-lg">ブライアン・エイモス</p>
					</div>

					<div>
						<p className="text-gray-500 text-sm">メール：</p>
						<a
							href="mailto:brianizzo93@gmai.com"
							className="text-yellow-600 hover:underline"
						>
							brianizzo93@gmail.com
						</a>
					</div>

				</div>
			</div>
		</div>
	);
}