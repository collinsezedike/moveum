"use client";

import { Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-gray-50 border-t border-gray-100">
			<div className="container mx-auto px-6 py-12">
				<div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
					<div className="text-center md:text-left">
						<h3 className="text-lg font-serif font-semibold text-gray-900 mb-2">
							MOVEUM
						</h3>
						<p className="text-sm text-gray-600">
							Built with ❤️ for Movement
						</p>
					</div>

					<div className="flex items-center space-x-6">
						<a
							href="#"
							className="text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="Facebook"
						>
							<Facebook size={20} />
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="Instagram"
						>
							<Instagram size={20} />
						</a>

						<a
							href="#"
							className="text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="Twitter"
						>
							<Twitter size={20} />
						</a>
					</div>

					<div className="flex items-center space-x-6 text-sm text-gray-600">
						<a
							href="#"
							className="hover:text-gray-900 transition-colors"
						>
							Privacy
						</a>
						<a
							href="#"
							className="hover:text-gray-900 transition-colors"
						>
							Terms
						</a>
						<span>&copy; {new Date().getFullYear()} Moveum</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
