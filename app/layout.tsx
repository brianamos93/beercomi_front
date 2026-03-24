import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/interface/Footer";

import { getLoggedInUsersData } from "./utils/requests/userRequests";
import { AuthProvider } from "./components/AuthProvider";
import Header from "./components/interface/Header";
import Link from "next/link";
import { baseMetadata } from "./utils/libs/metadata";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = baseMetadata;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getLoggedInUsersData();
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto mb-8 px-8`}
			>
				<AuthProvider initialUser={user}>
					{user?.role === "admin" && (
						<div className="bg-red-600 text-white text-sm py-2 px-4 flex justify-between items-center">
							<span>Admin Charts</span>
							<Link
								href={"/users/admin"}
								className="underline hover:text-gray-200"
							>
								View Charts
							</Link>
						</div>
					)}
					<Header />
					{children}
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}
