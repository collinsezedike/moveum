import { type ReactNode } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { PrivyProvider } from "@privy-io/react-auth";

import { MOVEMENT_CONFIGS, CURRENT_NETWORK } from "../lib/aptos";

interface AptosProviderProps {
	children: ReactNode;
}

function AptosProvider({ children }: AptosProviderProps) {
	const aptosConfig = new AptosConfig({
		network: Network.TESTNET,
		fullnode: MOVEMENT_CONFIGS[CURRENT_NETWORK].fullnode,
	});

	return (
		<AptosWalletAdapterProvider
			autoConnect={true}
			dappConfig={aptosConfig}
			onError={(error) => {
				console.error("Wallet error:", error);
			}}
		>
			{children}
		</AptosWalletAdapterProvider>
	);
}

export default function WalletProvider({ children }: { children: ReactNode }) {
	return (
		<AptosProvider>
			<PrivyProvider appId={import.meta.env.VITE_PRIVY_APP_ID || ""}>
				{children}
			</PrivyProvider>
		</AptosProvider>
	);
}
