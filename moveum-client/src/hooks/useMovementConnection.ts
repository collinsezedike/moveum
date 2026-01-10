import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePrivy, type WalletWithMetadata } from "@privy-io/react-auth";

export function useMovementConnection() {
	const {
		connect,
		wallets,
		connected: isNativeConnected,
		account: nativeAccount,
		disconnect: nativeDisconnect,
		wallet,
		signTransaction,
	} = useWallet();
	const { authenticated, user, login, logout } = usePrivy();

	const privyMovementWallet = user?.linkedAccounts?.find(
		(acc): acc is WalletWithMetadata =>
			acc.type === "wallet" && (acc as any).chainType === "aptos"
	);

	const isConnected =
		isNativeConnected || (authenticated && !!privyMovementWallet);

	const address = isNativeConnected
		? nativeAccount?.address
		: privyMovementWallet?.address;

	const disconnect = async () => {
		if (isNativeConnected) await nativeDisconnect();
		if (authenticated && !!privyMovementWallet) await logout();
	};

	return {
		address,
		isConnected,
		disconnect,

		// Privy only
		user,
		login,
		authenticated,
		privyMovementWallet,

		// Native only
		connect,
		wallet,
		wallets,
		nativeAccount,
		signTransaction,
		isNativeConnected,
	};
}
