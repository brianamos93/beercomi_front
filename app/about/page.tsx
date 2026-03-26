import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "アプリについて",
  description: "ビールの評価・レビュー・管理ができるフルスタックアプリ「ビアログ」。実務を想定した設計で、検索・投稿・データ管理機能を実装。",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-10 space-y-10">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">アプリについて</h1>
          <p className="text-gray-600 mt-2">
            フルースタックのビール評価するアプリ
          </p>
        </div>

        {/* Description */}
        <section className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            This application allows users to browse beers, write reviews, and rate
            their favorites. The project was built to explore modern web development
            using Next.js and a custom backend API.
          </p>

          <p>
            The goal was to create a clean, responsive interface while building a
            practical full-stack project that includes authentication, database
            interaction, and user-generated content.
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            工夫点
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>User authentication with login and logout</li>
            <li>Browse beers and view detailed beer pages</li>
            <li>Create and edit beer reviews</li>
            <li>Rating system for beers</li>
            <li>Recent activity feed showing latest reviews</li>
            <li>Responsive design built with Tailwind CSS</li>
          </ul>
        </section>

        {/* GitHub */}
        <section className="text-center pt-4 flex flex-col gap-4 md:flex-row md:justify-center">
          <Link
            href="https://github.com/brianamos93/beercomi_front"
            target="_blank"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            View the Frontend Source on GitHub
          </Link>

          <Link
            href="https://github.com/brianamos93/beercomi"
            target="_blank"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            View the Backend Source on GitHub
          </Link>
        </section>

      </div>
    </main>
  );
}