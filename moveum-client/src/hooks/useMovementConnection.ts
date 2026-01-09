// hooks/useMovementConnection.ts
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { usePrivy, type WalletWithMetadata } from "@privy-io/react-auth";

export function useMovementConnection() {
	const {
		connected: isNativeConnected,
		account: nativeAccount,
		connect,
		disconnect: nativeDisconnect,
		wallets,
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
		isConnected,
		address,
		isNativeConnected,
		authenticated,
		user,
		login,
		connect,
		disconnect,
		wallets,
		privyMovementWallet,
	};
}
