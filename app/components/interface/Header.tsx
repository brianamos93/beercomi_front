"use client"

type Props = {
  user: {
    display_name: string;
    profile_img_url: string;
    isAuthenticated: boolean;
  }
}
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Header({ user }: Props) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname()
  
  const links = [
    {
      "page": "About",
      "route": "/about"
    },
    {
      "page": "Beers",
      "route": "/beers"
    },
    {
      "page": "Breweries",
      "route": "/breweries"
    },
    {
      "page": "Stores",
      "route": "/stores"
    },
    {
      "page": "Contact",
      "route": "/contact"
    }
  ]

  return (
    <div className="flex items-center justify-between border-b border-gray-400 py-8">
		<Link href="/">
			つながる
		</Link>
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
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
                {user.isAuthenticated ? (
                  <>
                    <li className="text-sm text-gray-700">
                      Welcome back! {user.display_name}</li>
                      
                  </>
                ) : (
                  <>
                      <li className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setIsNavOpen(false)}>
                        <Link href="/users/login">Login</Link>
                      </li>

                      <li className="px-4 py-2 text-sm bg-gray-300 text-black rounded hover:bg-gray-400" onClick={() => setIsNavOpen(false)}>
                        <Link href="/users/signup">Sign Up</Link>
                      </li>
                  </>
                )}
              {links.map((link) => (
                <li key={link.page} onClick={() => setIsNavOpen(false)}>
                  <Link href={link.route} className={clsx('border-b border-gray-400 my-8 uppercase',{
                    'text-yellow-600 underline': pathname === link.route,
                  },)}>{link.page}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <ul className="DESKTOP-MENU hidden space-x-8 lg:flex">
          {links.map((link) => (
            <li key={link.page}>
              <Link href={link.route} className={clsx('hover:text-yellow-600', {'text-yellow-600 underline': pathname === link.route,})}>{link.page}</Link>
            </li>
          ))}
           <li>
                {user.isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Welcome back! {user.display_name ?? "User"}</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/users/login">
                      <span className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                        Login
                      </span>
                    </Link>
                    <Link href="/users/signup">
                      <span className="px-4 py-2 text-sm bg-gray-300 text-black rounded hover:bg-gray-400">
                        Sign Up
                      </span>
                    </Link>
                  </div>
                )}
              </li>
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
