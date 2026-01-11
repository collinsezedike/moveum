import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
	AccountAuthenticator,
	Deserializer,
	Hex,
	SimpleTransaction,
	type PendingTransactionResponse,
	type UserTransactionResponse,
} from "@aptos-labs/ts-sdk";

import { useMovementConnection } from "../hooks/useMovementConnection";
import { movementClient } from "../lib/movement";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "";

const ArchiveForm = () => {
	const { signTransaction, address, isPrivyConnected } =
		useMovementConnection();

	const [formData, setFormData] = useState({
		id: "",
		title: "",
		year: new Date().getFullYear(),
		description: "",
		imageUrl: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const randomId = crypto.randomUUID().split("-")[0].toUpperCase();
		const timestamp = Date.now().toString().slice(-4);
		setFormData((prev) => ({
			...prev,
			id: `ART-${randomId}-${timestamp}`,
		}));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const loadingToast = toast.loading("Archiving Artifact...");

		try {
			const response = await fetch(SERVER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					sender: address?.toString(),
					senderCanSign: !isPrivyConnected,
					...formData,
				}),
			});
			const data = await response.json();

			let pendingTx: PendingTransactionResponse;

			if (!isPrivyConnected) {
				const simpleTx = SimpleTransaction.deserialize(
					new Deserializer(
						Hex.fromHexString(data.simpleTx).toUint8Array()
					)
				);

				const senderSig = await signTransaction({
					transactionOrPayload: simpleTx,
				});

				const sponsorSig = AccountAuthenticator.deserialize(
					new Deserializer(
						Hex.fromHexString(
							data.sponsorAuthenticator
						).toUint8Array()
					)
				);

				pendingTx = await movementClient.transaction.submit.simple({
					transaction: simpleTx,
					senderAuthenticator: senderSig.authenticator,
					feePayerAuthenticator: sponsorSig,
				});
			} else {
				pendingTx = data.pendingTx;
			}

			toast.loading("Verifying transaction...", { id: loadingToast });

			const executedTransaction =
				(await movementClient.waitForTransaction({
					transactionHash: pendingTx?.hash,
				})) as UserTransactionResponse;

			if (executedTransaction.success) {
				toast.success("Artifact archived successfully!", {
					id: loadingToast,
				});

				// Reset form
				setFormData({
					id: `ART-${crypto
						.randomUUID()
						.split("-")[0]
						.toUpperCase()}-${Date.now().toString().slice(-4)}`,
					title: "",
					year: new Date().getFullYear(),
					description: "",
					imageUrl: "",
				});
			} else toast.error("Transaction failed", { id: loadingToast });
		} catch (error: any) {
			console.error(error);
			toast.error("An error occured", {
				description: error.message,
				id: loadingToast,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto bg-white border border-stone-200 text-black p-8 shadow-sm">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-2 gap-6">
					<div className="flex flex-col">
						<label className="text-xs uppercase tracking-widest text-stone-500 mb-2">
							Unique ID (Auto-generated)
						</label>
						<input
							readOnly
							className="border-b border-stone-200 py-2 bg-stone-50/50 text-stone-400 font-mono text-sm cursor-not-allowed outline-none"
							value={formData.id}
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-xs uppercase tracking-widest text-stone-500 mb-2">
							Year (Current)
						</label>
						<input
							readOnly
							className="border-b border-stone-200 py-2 bg-stone-50/50 text-stone-400 cursor-not-allowed outline-none"
							value={formData.year}
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<label className="text-xs uppercase tracking-widest text-stone-500 mb-2">
						Artifact Title
					</label>
					<input
						required
						className="border-b border-stone-300 py-2 focus:border-stone-800 outline-none transition-colors text-lg"
						placeholder="Name of the piece"
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-xs uppercase tracking-widest text-stone-500 mb-2">
						Image URL (IPFS/Web)
					</label>
					<input
						required
						type="url"
						className="border-b border-stone-300 py-2 focus:border-stone-800 outline-none transition-colors"
						placeholder="https://ipfs.io/ipfs/..."
						value={formData.imageUrl}
						onChange={(e) =>
							setFormData({
								...formData,
								imageUrl: e.target.value,
							})
						}
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-xs uppercase tracking-widest text-stone-500 mb-2">
						Description
					</label>
					<textarea
						required
						rows={4}
						className="border border-stone-200 p-3 focus:border-stone-800 outline-none transition-colors resize-none text-stone-700"
						placeholder="Provide historical context..."
						value={formData.description}
						onChange={(e) =>
							setFormData({
								...formData,
								description: e.target.value,
							})
						}
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className={`w-full py-4 bg-stone-900 text-white uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors ${
						isSubmitting ? "opacity-50 cursor-not-allowed" : ""
					}`}
				>
					{isSubmitting
						? "Archiving on Chain..."
						: "Submit to Museum"}
				</button>
			</form>
		</div>
	);
};

export default ArchiveForm;
