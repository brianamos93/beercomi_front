import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "アプリについて",
	description:
		"ビールの評価・レビュー・管理ができるフルスタックアプリ「ビアログ」。実務を想定した設計で、検索・投稿・データ管理機能を実装。",
};

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-gray-100 py-12 px-6">
			<div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-10 space-y-10">
				{/* Title */}
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-800">アプリについて</h1>
					<p className="text-gray-600 mt-2">
						フルスタックのビール評価アプリ
					</p>
				</div>

				{/* Description */}
				<section className="space-y-4 text-gray-700 leading-relaxed">
					<p>
						海外発のビールレビューアプリにおいて、評価基準が欧米の嗜好に偏っている課題に着目し、日本人ユーザーの好みに基づいたビール選択を支援するWebアプリケーションを開発。
						モダン技術を組み合わせた中規模アプリケーションの開発を通じて、設計から実装まで一貫した開発スキルの習得・向上に取り組んだ。
					</p>
				</section>

				{/* Tech Stack */}
				<section>
					<h2 className="text-xl font-semibold mb-4 text-gray-800">
						テックスタック
					</h2>

					<div className="flex flex-wrap gap-3">
						{[
							"Next.js",
							"React",
							"Tailwind CSS",
							"Node.js",
							"Express",
							"PostgreSQL",
							"JWT 認証",
						].map((tech) => (
							<span
								key={tech}
								className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
							>
								{tech}
							</span>
						))}
					</div>
				</section>

				{/* Features */}
				<section>
					<h2 className="text-xl font-semibold mb-4 text-gray-800">工夫点</h2>

					<ul className="list-disc list-inside space-y-2 text-gray-700">
						<li>
							画面の目的に応じてSSG / SSR / CSRを使い分け、表示速度とSEOの最適化を実現
						</li>
						<li>
							ユースケースごとにページネーション手法を使い分け、パフォーマンスとユーザー体験を向上
						</li>
						<li>
							フロントエンドとバックエンドを分離した構成により、スケーラビリティおよび保守性を確保
						</li>
						<li>
							JWTを用いた認証・認可機構を実装し、セキュアなユーザー管理を実現
						</li>
						<li>
							リレーショナルデータベースの特性を活かしたスキーマ設計により、データ整合性を担保
						</li>
						<li>
							コンポーネント設計およびAPI設計の統一により、再利用性と可読性を向上
						</li>
						<li>
							エラーハンドリングおよびバリデーションの統一により、アプリケーションの安定性を向上
						</li>
					</ul>
				</section>

				{/* GitHub */}
				<section className="text-center pt-4 flex flex-col gap-4 md:flex-row md:justify-center">
					<Link
						href="https://github.com/brianamos93/beercomi_front"
						target="_blank"
						className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
					>
						フロントエンドのコードをGithubで見る
					</Link>

					<Link
						href="https://github.com/brianamos93/beercomi"
						target="_blank"
						className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
					>
						バックエンドのコードをGithubで見る
					</Link>
				</section>
			</div>
		</main>
	);
}
