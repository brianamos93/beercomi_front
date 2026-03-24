"use client";
import { useActionState } from "react";
import { Login } from "../../utils/requests/userRequests";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import SubmitButton from "../../components/form/SubmitButton";
import Form from 'next/form'


const initialState = { error: {}, success: undefined };

export default function LoginForm() {
	const [state, formAction] = useActionState(Login, initialState);
	const { pending } = useFormStatus();

	if (state?.success) {
		redirect("/");
	}

	return (
		<div className="flex items-center justify-center min-h-[60vh] px-4">
			<Form
				action={formAction}
				className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-5"
			>
				<h2 className="text-2xl font-semibold text-center text-gray-800">
					ログイン
				</h2>

				{/* Email */}
				<div className="space-y-1">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						メール
					</label>

					<input
						name="email"
						id="email"
						type="email"
						placeholder="email@example.com"
						className="w-full border text-gray-800 border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>

					{state?.error?.email && (
						<p className="text-sm text-red-600">{state.error.email}</p>
					)}
				</div>

				{/* Password */}
				<div className="space-y-1">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						パスワード
					</label>

					<input
						name="password"
						id="password"
						type="password"
						placeholder="パスワードを入力してください。"
						className="w-full text-gray-800 border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>

					{state?.error?.password && (
						<p className="text-sm text-red-600">{state.error.password}</p>
					)}
				</div>

				{/* General error */}
				{state?.error?.general && (
					<div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
						{state.error.general}
					</div>
				)}

				<SubmitButton loadingText="ログイン中…" isSubmitting={pending}>ログイン</SubmitButton>
				

				{/* Optional signup link */}
				<p className="text-center text-sm text-gray-600">
					アカウントをお持ちでない方は
					<Link
						href="/users/signup"
						className="hover:underline ml-1 font-medium text-amber-500 hover:text-amber-600"
					>
						登録
					</Link>
				</p>
			</Form>
		</div>
	);
}
