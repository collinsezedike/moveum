import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-stone-50">
			<AnimatePresence mode="wait">
				<motion.div
					key="content"
					initial={{
						opacity: 0,
						scale: 1.05,
						filter: "blur(10px)",
					}}
					animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
					transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
				>
					<Header />
					<main>
						<section className="h-screen flex items-center justify-center">
							<div className="text-center space-y-8 px-6">
								<motion.h2
									initial={{ y: 40, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{
										delay: 0.5,
										duration: 0.8,
									}}
									className="text-5xl md:text-7xl font-serif font-light text-stone-900"
								>
									Welcome to the Moveum
								</motion.h2>
								<motion.button
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1 }}
									onClick={() => navigate("/gallery")}
									className="px-12 py-4 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-500 rounded-full uppercase text-xs tracking-[0.3em] cursor-pointer"
								>
									Explore Gallery
								</motion.button>
							</div>
						</section>
					</main>
					<Footer />
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
