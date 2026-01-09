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

		if (existingWallet) {
			console.log(
				"Movement wallet already exists:",
				existingWallet.address
			);
			return existingWallet;
		}

		console.log("Creating new Movement wallet for user...");
		const wallet = await createWallet({ chainType: "aptos" });

		console.log(
			"Movement wallet created successfully:",
			(wallet as any).address
		);
		return wallet;
	} catch (error) {
		console.error("Error creating Movement wallet:", error);
		throw error;
	}
}
