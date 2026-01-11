import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
	return (
		<div className="min-h-screen bg-[#fdfcfb]">
			<Header />

			<main className="pt-25">
				<section className="py-16">
					<motion.div
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, margin: "-100px" }}
						className="container mx-auto px-8"
					>
						<div className="max-w-4xl mx-auto text-center">
							<motion.h1
								initial={{
									opacity: 0,
									y: 15,
									filter: "blur(12px)",
									letterSpacing: "-0.05em",
								}}
								animate={{
									opacity: 1,
									y: 0,
									filter: "blur(0px)",
									letterSpacing: "0em",
								}}
								transition={{
									duration: 2.8,
									ease: [0.22, 1, 0.36, 1],
								}}
								className="text-5xl md:text-8xl font-serif text-stone-900 mb-16 tracking-tight italic"
							>
								About the Moveum
							</motion.h1>

							<div className="prose prose-lg mx-auto text-stone-700 leading-relaxed">
								<motion.p
									initial={{
										opacity: 0,
										y: 15,
										filter: "blur(12px)",
										letterSpacing: "-0.05em",
									}}
									animate={{
										opacity: 1,
										y: 0,
										filter: "blur(0px)",
										letterSpacing: "0em",
									}}
									transition={{
										duration: 2.8,
										ease: [0.22, 1, 0.36, 1],
									}}
									className="text-2xl md:text-3xl font-light text-stone-400 mb-24 leading-snug italic"
								>
									"...the past is a foreign country; they do
									things differently there. But in the digital
									age, the past is also a fragile country. We
									must build the vessels that allow our
									culture to travel forward, or it will be
									erased by the very speed of our progress..."
									<span className="block text-sm uppercase text-stone-700 tracking-widest mt-6 font-sans not-italic">
										— L.P. Hartley & Stewart Brand (The Long
										Now Foundation)
									</span>
								</motion.p>
							</div>
						</div>
					</motion.div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
