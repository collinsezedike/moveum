import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UploadForm from "../components/ArchiveForm";
import { useMovementConnection } from "../hooks/useMovementConnection";
import { WalletSelectionModal } from "../components/WalletSelectionModal";

export default function Archive() {
	const { isConnected } = useMovementConnection();

	return (
		<div className="min-h-screen bg-stone-50 selection:bg-stone-200 flex flex-col">
			<Header />

			<main className="flex-grow pt-32 pb-24 px-6">
				<div className="max-w-4xl mx-auto">
					<header className="mb-16 text-center space-y-4">
						<h1 className="text-4xl md:text-5xl font-serif font-light text-stone-900">
							Archive an Artifact
						</h1>
						<p className="text-stone-500 max-w-md mx-auto font-light leading-relaxed">
							Contribute to the permanent on-chain record. Your
							submission will be immutably stored on the Aptos
							blockchain.
						</p>
					</header>

					<section className="relative">
						<div className="absolute -top-4 -left-4 w-12 h-12 border-t border-l border-stone-300" />
						<div className="absolute -bottom-4 -right-4 w-12 h-12 border-b border-r border-stone-300" />

						<div className="min-h-[400px] flex items-center justify-center py-20 bg-white/50 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-sm border border-white">
							<AnimatePresence mode="wait">
								{!isConnected ? (
									<motion.div
										key="connect-state"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="w-full max-w-xs px-6 text-center"
									>
										<p className="text-stone-400 text-sm mb-6 uppercase tracking-widest">
											Authentication Required
										</p>
										<WalletSelectionModal>
											<button className="w-full py-4 bg-stone-900 text-white rounded-full uppercase text-xs tracking-widest cursor-pointer hover:bg-stone-800 transition-colors">
												Connect Wallet
											</button>
										</WalletSelectionModal>
									</motion.div>
								) : (
									<motion.div
										key="form-state"
										initial={{
											opacity: 0,
											filter: "blur(10px)",
										}}
										animate={{
											opacity: 1,
											filter: "blur(0px)",
										}}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.6 }}
										className="w-full"
									>
										<UploadForm />
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</section>
				</div>
			</main>

			<Footer />
		</div>
	);
}
