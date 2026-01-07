"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import Header from "../components/Header";
import Footer from "../components/Footer";
import EntranceGate from "../components/EntranceGate";

export default function Home() {
	const [showEntrance, setShowEntrance] = useState(true);
	const router = useRouter();

	return (
		<div className="min-h-screen bg-stone-50">
			<AnimatePresence mode="wait">
				{showEntrance ? (
					<EntranceGate
						key="gate"
						onEnter={() => setShowEntrance(false)}
					/>
				) : (
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
										The Gallery is Open
									</motion.h2>
									<motion.button
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1, duration: 0.8 }}
										onClick={() => router.push("/gallery")}
										className="px-12 py-4 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-500 rounded-full uppercase text-xs tracking-[0.3em]"
									>
										Proceed to Collection
									</motion.button>
								</div>
							</section>
						</main>
						<Footer />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
