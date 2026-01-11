import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const MOVEMENT_CONFIGS = {
	mainnet: {
		chainId: 126,
		name: "Movement Mainnet",
		fullnode: "https://full.mainnet.movementinfra.xyz/v1",
		explorer: "mainnet",
	},
	testnet: {
		chainId: 250,
		name: "Movement Testnet",
		fullnode: "https://testnet.movementnetwork.xyz/v1",
		explorer: "testnet",
	},
};

export const CURRENT_NETWORK = "testnet" as keyof typeof MOVEMENT_CONFIGS;

export const movementClient = new Aptos(
	new AptosConfig({
		network: Network.CUSTOM,
		fullnode: MOVEMENT_CONFIGS[CURRENT_NETWORK].fullnode,
	})
);
