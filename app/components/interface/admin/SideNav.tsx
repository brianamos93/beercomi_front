"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// app/components/interface/admin/Sidenav.tsx

const links = [
	{ name: 'アクティビティログ', href: '/users/admin/activity' },
	{ name: 'ビールログ', href: '/users/admin/beers' },
	{ name: 'ブルワリーログ', href: '/users/admin/breweries' },
	{ name: 'レビューログ', href: '/users/admin/reviews' },
];

export default function SideNav() {
	const pathname = usePathname() || '';

	return (
		<aside className="h-full border-r bg-white">
			<div className="px-4 py-6">
				<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Admin</h2>
			</div>

			<nav className="px-2 py-4">
				<ul className="space-y-1">
					{links.map((link) => {
						const active = pathname === link.href || pathname.startsWith(link.href + '/');
						return (
							<li key={link.href}>
								<Link
									href={link.href}
									className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
										${active ? 'bg-gray-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
									aria-current={active ? 'page' : undefined}
								>
									{/* simple icon */}
									<span className="w-5 h-5 flex-none text-gray-400">
										{link.name === 'Activity Log' && (
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
												<path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
												<circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
											</svg>
										)}
										{link.name === 'Beers' && (
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
												<path d="M7 21h10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
												<path d="M7 7h10v14H7z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
												<path d="M9 7V5a3 3 0 0 1 6 0v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
											</svg>
										)}
										{link.name === 'Breweries' && (
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
												<path d="M3 21h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
												<path d="M7 21V8l5-4 5 4v13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
												<path d="M9 10h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
											</svg>
										)}
										{link.name === 'Review Overview' && (
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
												<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
											</svg>
										)}
									</span>

									<span className="truncate">{link.name}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
}