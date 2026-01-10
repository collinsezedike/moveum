import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import Header from "../components/Header";
import { WalletSelectionModal } from "../components/WalletSelectionModal";
import { useMovementConnection } from "../hooks/useMovementConnection";
import { useX402Payment } from "../hooks/usex402Payment";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "";

export default function Gate() {
	const navigate = useNavigate();
	const { isConnected } = useMovementConnection();
	const { payForAccess } = useX402Payment();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleVerifyPayment = async () => {
		if (!isConnected) return toast.error("Connect wallet");

		setIsProcessing(true);

		//  Clear out any previously cached data
		localStorage.removeItem("artifacts");

		const loadingToast = toast.loading("Verifying payment...");

		try {
			const res = await fetch(SERVER_URL);
			if (res.status !== 402) return navigate("/gallery");

			const { accepts } = await res.json();
			if (!accepts?.[0]) throw new Error("No payment requirements");

			toast.loading("Processing...", { id: loadingToast });
			const xPayment = await payForAccess(accepts[0]);

			toast.loading("Verifying...", { id: loadingToast });
			const paidRes = await fetch(SERVER_URL, {
				headers: { "X-PAYMENT": xPayment },
				redirect: "manual",
			});

			if (
				paidRes.status === 302 ||
				paidRes.ok ||
				paidRes.type === "opaqueredirect"
			) {
				const data = await paidRes.json();
				localStorage.setItem("artifacts", JSON.stringify(data));
				toast.success("Payment successful!", { id: loadingToast });
				return navigate("/gallery");
			} else {
				throw new Error("Payment failed");
			}
		} catch (err: any) {
			toast.error(err.message || "Payment failed", {
				id: loadingToast,
			});
		} finally {
			setIsProcessing(false);
		}
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
							className="w-full py-4 bg-stone-900 text-white rounded-full uppercase text-xs tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isProcessing ? "Verifying..." : "Pay Entry Fee"}
						</button>
					)}

					<button
						onClick={() => navigate("/")}
						disabled={isProcessing}
						className="mt-6 text-stone-400 text-xs uppercase tracking-tighter hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Return to Entrance
					</button>
				</motion.div>
			</main>
		</div>
	);
}
