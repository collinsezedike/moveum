import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { WalletSelectionModal } from "../components/WalletSelectionModal";
import Header from "../components/Header";
import { useMovementConnection } from "../hooks/useMovementConnection";

export default function Gate() {
	const navigate = useNavigate();
	const { isConnected } = useMovementConnection();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleVerifyPayment = async () => {
		setIsProcessing(true);
		// const response = await fetch("/api/artifacts", {
		// 	method: "GET",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		"X-Payment-Signature": "signature",
		// 	},
		// });
		// const { accepts } = await response.json();
		// if (!accepts?.[0]) throw new Error("No payment requirements");

		// Build the transaction

		// Sign and send

		setTimeout(() => {
			setIsProcessing(false);
			navigate("/gallery");
		}, 2000);
	};

	return (
		<div className="min-h-screen">
			<Header />
			<main className="flex flex-col items-center justify-center pt-30 px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center"
				>
					<h2 className="text-2xl text-stone-900 font-serif mb-4">
						Entry Fee Required
					</h2>

					<div className="bg-stone-100 p-6 rounded-xl mb-8 flex flex-col items-center">
						<div className="w-48 h-48 bg-white p-2 mb-4 shadow-inner">
							<div className="w-full h-full border-2 border-dashed border-stone-300 flex items-center justify-center text-xs text-stone-400">
								[-- Scan to Pay (0.01 MOVE) --]
							</div>
						</div>
					</div>

					{!isConnected ? (
						<WalletSelectionModal>
							<button className="w-full py-4 bg-stone-900 text-white rounded-full uppercase text-xs tracking-widest cursor-pointer">
								Connect Wallet
							</button>
						</WalletSelectionModal>
					) : (
						<button
							onClick={handleVerifyPayment}
							disabled={isProcessing}
							className="w-full py-4 bg-stone-900 text-white rounded-full uppercase text-xs tracking-widest disabled:opacity-50 cursor-pointer"
						>
							{isProcessing ? "Verifying..." : "Verify Payment"}
						</button>
					)}

					<button
						onClick={() => navigate("/")}
						className="mt-6 text-stone-400 text-xs uppercase tracking-tighter hover:text-stone-900 transition-colors cursor-pointer"
					>
						Return to Entrance
					</button>
				</motion.div>
			</main>
		</div>
	);
}
