"use client";

import { useRouter } from "next/navigation";

export default function NotFoundContent() {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center h-screen text-center px-4">
			<h1 className="text-6xl font-bold mb-4">404</h1>
			<p className="text-xl mb-6">
				お探しのページは見つかりませんでした。
			</p>
			<button
				onClick={() => router.back()}
				className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
			>
				戻る
			</button>
		</div>
	);
}
