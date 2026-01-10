import {
	Aptos,
	AptosConfig,
	Network,
	AccountAuthenticatorEd25519,
	Ed25519PublicKey,
	Ed25519Signature,
} from "@aptos-labs/ts-sdk";
import { buildAptosLikePaymentHeader } from "x402plus";

import { MOVEMENT_CONFIGS, CURRENT_NETWORK } from "../lib/aptos";
import { useMovementConnection } from "./useMovementConnection";

export function useX402Payment() {
	const { isConnected, nativeAccount, signTransaction } =
		useMovementConnection();

	const payForAccess = async (paymentRequirements: any): Promise<string> => {
		if (!isConnected || !nativeAccount)
			throw new Error("Wallet not connected");

		const aptos = new Aptos(
			new AptosConfig({
				network: Network.CUSTOM,
				fullnode: MOVEMENT_CONFIGS[CURRENT_NETWORK].fullnode,
			})
		);

		const tx = await aptos.transaction.build.simple({
			sender: nativeAccount.address,
			data: {
				function: "0x1::aptos_account::transfer",
				functionArguments: [
					paymentRequirements.payTo,
					paymentRequirements.maxAmountRequired,
				],
			},
		});

		const signAuthenticator = (
			await signTransaction({ transactionOrPayload: tx })
		).authenticator as AccountAuthenticatorEd25519;

		const accountAuthenticator = new AccountAuthenticatorEd25519(
			new Ed25519PublicKey(signAuthenticator.public_key.toUint8Array()),
			new Ed25519Signature(signAuthenticator.signature.toUint8Array())
		);

		return buildAptosLikePaymentHeader(paymentRequirements, {
			signatureBcsBase64: Buffer.from(
				accountAuthenticator.bcsToBytes()
			).toString("base64"),
			transactionBcsBase64: Buffer.from(tx.bcsToBytes()).toString(
				"base64"
			),
		});
	};

	return { payForAccess };
}
