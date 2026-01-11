export interface CreateWalletFunction {
	(params: { chainType: "aptos" }): Promise<any>;
}

export async function createMovementWallet(
	user: any,
	createWallet: CreateWalletFunction
): Promise<any> {
	try {
		const existingWallet = user?.linkedAccounts?.find(
			(account: any) =>
				account.type === "wallet" && account.chainType === "aptos"
		);
		if (!existingWallet) return await createWallet({ chainType: "aptos" });
		else return existingWallet;
	} catch (error) {
		console.error("Error creating Movement wallet:", error);
		throw error;
	}
}
