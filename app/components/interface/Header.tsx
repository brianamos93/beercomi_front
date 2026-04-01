"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "../AuthProvider";
import LogoutButton from "./logoutButton";
import SearchBar from "./SearchBar";

export default function Header() {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const pathname = usePathname();
	const { user } = useAuth();

	const links = [
		{
			page: "ホーム",
			route: "/",
		},
		{
			page: "ビアログとは",
			route: "/about",
		},
		{
			page: "ビール",
			route: "/beers",
		},
		{
			page: "醸造所",
			route: "/breweries",
		},
		{
			page: "お問い合わせ",
			route: "/contact",
		},
	];
	function handleNavClick() {
		setIsNavOpen(false);
	}

	return (
		<div className="flex items-center justify-between border-b border-gray-400 py-8">
			<Link href="/">ビアログ</Link>
			<nav>
				<section className="MOBILE-MENU flex lg:hidden">
					<div
						className="HAMBURGER-ICON space-y-2"
						onClick={() => setIsNavOpen((prev) => !prev)}
					>
						<span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
						<span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
						<span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
					</div>

					<div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
						<div
							className="absolute top-0 right-0 px-8 py-8"
							onClick={() => setIsNavOpen(false)}
						>
							<svg
								className="h-8 w-8 text-gray-600"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</div>
						<ul className="flex flex-col items-center space-y-6 py-8">
							<li>
								<SearchBar onSearch={() => setIsNavOpen(false)} />
							</li>

							{links.map((link) => (
								<li key={link.page} onClick={() => setIsNavOpen(false)}>
									<Link
										onClick={handleNavClick}
										href={link.route}
										className={clsx("border-b border-gray-400 my-8 uppercase", {
											"text-amber-400 underline": pathname === link.route,
										})}
									>
										{link.page}
									</Link>
								</li>
							))}
							{user ? (
								<>
									<li>
										<Link onClick={handleNavClick} href="/users/profile">
											Profile
										</Link>
									</li>
									<li className="flex items-center">
										<LogoutButton onClick={handleNavClick} />
									</li>
								</>
							) : (
								<>
									<li
										className="px-4 py-2 text-sm bg-amber-400 text-black rounded hover:bg-amber-600"
										onClick={() => setIsNavOpen(false)}
									>
										<Link href="/users/login">ログイン</Link>
									</li>

									<li
										className="px-4 py-2 text-sm bg-gray-300 text-black rounded hover:bg-gray-400"
										onClick={() => setIsNavOpen(false)}
									>
										<Link href="/users/signup">登録</Link>
									</li>
								</>
							)}
						</ul>
					</div>
				</section>
				<ul className="DESKTOP-MENU hidden space-x-8 lg:flex items-center">
					{links.map((link) => (
						<li key={link.page} className="flex items-center">
							<Link
								href={link.route}
								className={clsx("hover:text-amber-600", {
									"text-amber-400 underline": pathname === link.route,
								})}
							>
								{link.page}
							</Link>
						</li>
					))}

					<li className="flex items-center">
						<SearchBar />
					</li>

					{user ? (
						<>
							<li className="flex items-center">
								<Link href="/users/profile">プロフィール</Link>
							</li>
							<li className="flex items-center">
								<LogoutButton />
							</li>
						</>
					) : (
						<>
							<li className="flex items-center">
								<Link href="/users/login">
									<span className="px-4 py-2 text-sm bg-amber-400 text-black rounded hover:bg-amber-600">
										ログイン
									</span>
								</Link>
							</li>
							<li className="flex items-center">
								<Link href="/users/signup">
									<span className="px-4 py-2 text-sm bg-gray-300 text-black rounded hover:bg-gray-400">
										登録
									</span>
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
			<style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
		</div>
	);
}
