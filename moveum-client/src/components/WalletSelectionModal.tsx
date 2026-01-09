import { useState } from "react";
import { useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { useLogin } from "@privy-io/react-auth";

import { useMovementConnection } from "../hooks/useMovementConnection";
import { createMovementWallet } from "../lib/privy-movement";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

const WalletTile = ({ name, icon, onClick }: any) => (
	<button
		onClick={onClick}
		className="flex items-center justify-between w-full h-14 p-3 rounded-xl border border-input hover:bg-stone-900 transition-all group cursor-pointer"
	>
		<div className="flex items-center gap-3">
			{icon && (
				<img
					src={icon}
					alt={name}
					className="w-8 h-8 rounded-lg shadow-sm"
				/>
			)}
			<span className="font-semibold text-sm">{name}</span>
		</div>
	</button>
);

export function WalletSelectionModal({
	children,
}: {
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const { createWallet } = useCreateWallet();
	const { wallets, connect, authenticated, user, privyMovementWallet } =
		useMovementConnection();

	const { login } = useLogin({ onComplete: (u) => handleWalletCreation(u) });

	const filteredWallets = wallets
		?.filter((wallet) => {
			const name = wallet.name.toLowerCase();
			return (
				!name.includes("petra") &&
				!name.includes("google") &&
				!name.includes("apple")
			);
		})
		.filter((wallet, index, self) => {
			return index === self.findIndex((w) => w.name === wallet.name);
		})
		.sort((a, b) => {
			if (a.name.toLowerCase().includes("nightly")) return -1;
			if (b.name.toLowerCase().includes("nightly")) return 1;
			return 0;
		});

	const handleWalletCreation = async (targetUser: any) => {
		try {
			setIsCreating(true);
			await createMovementWallet(targetUser, createWallet);
			setOpen(false);
		} finally {
			setIsCreating(false);
		}
	};

	const handlePrivyAction = () => {
		if (!authenticated) login();
		else if (!privyMovementWallet) handleWalletCreation(user);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
				<div className="p-6 space-y-6">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">
							Connect Wallet
						</DialogTitle>
					</DialogHeader>

					<Button
						onClick={handlePrivyAction}
						disabled={isCreating}
						className="w-full h-14 px-12 py-4 border border-none bg-white text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-500 rounded-xl uppercase text-xs tracking-[0.3em] cursor-pointer"
					>
						{isCreating
							? "Initializing..."
							: !authenticated
							? "Social / Email"
							: "Create Wallet"}
					</Button>

					<div className="relative py-2 text-center text-xs uppercase text-muted-foreground font-semibold">
						<div className="absolute inset-0 flex items-center">
							<Separator />
						</div>
						<span className="relative bg-background px-4 uppercase tracking-widest">
							Or Extension
						</span>
					</div>

					{filteredWallets?.length === 0 ? (
						<div className="text-center py-6 px-4 border border-dashed rounded-lg">
							<p className="text-sm text-muted-foreground mb-2">
								No wallets detected
							</p>
							<p className="text-xs text-muted-foreground">
								Please install a supported Aptos wallet like
								Nightly
							</p>
						</div>
					) : (
						<div className="grid gap-2 max-h-[220px] overflow-y-auto pr-1">
							{filteredWallets.map((wallet) => (
								<WalletTile
									key={wallet.name}
									name={wallet.name}
									icon={wallet.icon}
									onClick={() => {
										connect(wallet.name as any);
										setOpen(false);
									}}
								/>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
