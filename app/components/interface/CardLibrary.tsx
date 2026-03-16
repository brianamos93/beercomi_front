import ArrowRightIcon from "@heroicons/react/20/solid/ArrowRightIcon";
import Link from "next/link";
import { ReactNode } from "react";

export function CardBase({ children }: { children: ReactNode }) {
	return (
		<div className="max-w-sm md:max-w-lg bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col overflow-hidden break-words min-w-0">
			{children}
		</div>
	);
}

export function CardImage({ children }: { children: ReactNode }) {
	return (
		<div className="relative w-full h-64 bg-gray-50 dark:bg-gray-700">
			{children}
		</div>
	);
}
export function CardContent({ children }: { children: ReactNode }) {
	return <div className="flex flex-col flex-grow p-5">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
	return (
		<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 break-words hover:underline">
			{children}
		</h2>
	);
}

export function CardMeta({ children }: { children: ReactNode }) {
	return (
		<div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
			{children}
		</div>
	);
}

export function CardAction({ link, type }: { link: string; type: string }) {
	return (
		<div className="mt-5">
			<Link
				href={link}
				className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600 hover:text-yellow-700"
			>
				View {type}
				<ArrowRightIcon className="h-4 w-4" />
			</Link>
		</div>
	);
}
