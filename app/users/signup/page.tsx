"use client";
import { signup } from "@/app/actions/auth";
import SubmitButton from "@/app/components/form/SubmitButton";
import { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";

export const metadata: Metadata = {
  title: "新規登録｜ビアログをはじめる",
  description:
    "ビアログのアカウントを作成して、レビュー投稿や評価などの機能を利用しましょう。",
};

export default function SignupForm() {
	const [state, action, pending] = useActionState(signup, undefined);

	return (
		<div className="flex items-center justify-center min-h-[60vh] px-4">
			<Form
				action={action}
				className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6"
			>
				<h2 className="text-2xl font-semibold text-gray-800 text-center">
					Create Account
				</h2>

				{/* Display Name */}
				<div className="space-y-1">
					<label
						htmlFor="display_name"
						className="block text-sm font-medium text-gray-700"
					>
						Display Name
					</label>
					<input
						type="text"
						name="display_name"
						id="display_name"
						placeholder="Display Name"
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
					{state?.errors?.display_name && (
						<p className="text-sm text-red-600">{state.errors.display_name}</p>
					)}
				</div>

				{/* Email */}
				<div className="space-y-1">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<input
						type="email"
						name="email"
						id="email"
						placeholder="email@email.com"
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
					{state?.errors?.email && (
						<p className="text-sm text-red-600">{state.errors.email}</p>
					)}
				</div>

				{/* Password */}
				<div className="space-y-1">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Enter password"
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>

					{state?.errors?.password && (
						<div className="text-sm text-red-600 mt-2">
							<p className="font-medium">Password must:</p>
							<ul className="list-disc ml-5">
								{state.errors.password.map((error) => (
									<li key={error}>{error}</li>
								))}
							</ul>
						</div>
					)}
				</div>

				{/* Button */}

				<SubmitButton loadingText="Signing up" isSubmitting={pending}>Sign Up</SubmitButton>

				<p className="text-center text-sm text-gray-600">
					Already have an account?
					<Link
						href="/users/login"
						className="hover:underline ml-1 font-medium text-amber-500 hover:text-amber-600"
					>
						Login
					</Link>
				</p>
			</Form>
		</div>
	);
}
