"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
	const pathname = usePathname();

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
			<nav className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="text-2xl font-serif font-semibold text-gray-900"
					>
						MOVEUM
					</Link>
					<div className="flex items-center space-x-8">
						<Link
							href="/"
							className={`text-sm font-medium transition-colors hover:text-gray-900 ${
								pathname === "/"
									? "text-gray-900"
									: "text-gray-600"
							}`}
						>
							Home
						</Link>
						<Link
							href="/gallery"
							className={`text-sm font-medium transition-colors hover:text-gray-900 ${
								pathname === "/gallery"
									? "text-gray-900"
									: "text-gray-600"
							}`}
						>
							Gallery
						</Link>
						<Link
							href="/about"
							className={`text-sm font-medium transition-colors hover:text-gray-900 ${
								pathname === "/about"
									? "text-gray-900"
									: "text-gray-600"
							}`}
						>
							About
						</Link>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
