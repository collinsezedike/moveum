import express from "express";
import cors from "cors";
import { x402Paywall } from "x402plus";
import {
	GasStationClient,
	KeyClient,
	ShinamiWalletSigner,
	WalletClient,
} from "@shinami/clients/aptos";
import {
	Aptos,
	AccountAddress,
	AptosConfig,
	MoveString,
	Network,
	SimpleTransaction,
} from "@aptos-labs/ts-sdk";
import "dotenv/config";

interface Artifact {
	id: string;
	title: string;
	year: number;
	description: string;
	imageUrl: string;
}

const PORT = process.env.PORT || 4402;
const PACKAGE_ID = process.env.MOVEUM_PACKAGE_ID || "";
const TREASURY_ADDRESS = process.env.MOVEUM_TREASURY_ADDRESS || "";
const TREASURY_SECRET = process.env.MOVEUM_TREASURY_SECRET || "";
const GAS_STATION_ACCESS_KEY = process.env.GAS_STATION_ACCESS_KEY || "";

if (!PACKAGE_ID) {
	throw Error("PACKAGE_ID .env variable not set");
}

if (!TREASURY_ADDRESS) {
	throw Error("TREASURY_ADDRESS .env variables not set");
}

if (!TREASURY_SECRET) {
	throw Error("TREASURY_SECRET .env variables not set");
}

if (!GAS_STATION_ACCESS_KEY) {
	throw Error("GAS_STATION_ACCESS_KEY .env variables not set");
}

const gasClient = new GasStationClient(GAS_STATION_ACCESS_KEY);
const walletClient = new WalletClient(GAS_STATION_ACCESS_KEY);
const keyClient = new KeyClient(GAS_STATION_ACCESS_KEY);
const treasurySigner = new ShinamiWalletSigner(
	TREASURY_ADDRESS,
	walletClient,
	TREASURY_SECRET,
	keyClient
);
const treasurySignerAddress = await treasurySigner.getAddress();

const movementClient = new Aptos(
	new AptosConfig({
		network: Network.CUSTOM,
		fullnode: "https://testnet.movementnetwork.xyz/v1",
	})
);

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		exposedHeaders: ["X-PAYMENT-RESPONSE"],
	})
);

app.use(express.json());

app.use(
	x402Paywall(
		TREASURY_ADDRESS,
		{
			"GET /api/artifacts": {
				network: "movement-testnet",
				asset: "0x1::aptos_coin::AptosCoin",
				maxAmountRequired: "1000000", // 0.01 MOVE
				description: "Moveum Gate Fee",
				mimeType: "application/json",
				maxTimeoutSeconds: 600,
			},
		},
		{
			url: "https://facilitator.stableyard.fi",
		}
	)
);

app.get("/api/artifacts", async (_req, res) => {
	try {
		const ids = await movementClient.view({
			payload: {
				function: `${PACKAGE_ID}::gallery::get_all_artifact_ids`,
				functionArguments: [],
			},
		});
		const artifactIds = ids[0] as string[];

		if (!artifactIds) return res.status(404).json("No artifacts found");

		const artifacts = await Promise.all(
			artifactIds.map(async (id) => {
				const details = await movementClient.view({
					payload: {
						function: `${PACKAGE_ID}::gallery::get_artifact_details`,
						functionArguments: [id],
					},
				});

				return {
					id,
					title: details[0],
					year: Number(details[1]),
					description: details[2],
					imageUrl: details[3],
					artist: details[4],
				};
			})
		);

		res.json(artifacts);
	} catch (error) {
		console.error("Error fetching artifacts:", error);
		res.status(500).json({ error: "Failed to fetch artifacts" });
	}
});

app.post("/api/artifacts", async (req, res) => {
	try {
		const {
			sender,
			id,
			title,
			year,
			description,
			imageUrl,
			senderCanSign,
		} = req.body;
		if (
			!sender?.trim() ||
			!id?.trim() ||
			!title?.trim() ||
			!year ||
			!description?.trim() ||
			!imageUrl?.trim()
		) {
			return res.status(400).json("Missing required fields");
		}

		const simpleTx = await buildSimpleMoveCallTransaction(
			!senderCanSign
				? treasurySignerAddress
				: AccountAddress.from(sender),
			{ id, title, year, description, imageUrl }
		);

		if (!senderCanSign) {
			const pendingTx = await treasurySigner.executeGaslessTransaction(
				simpleTx
			);
			return res.json({ pendingTx });
		}
		const sponsorAuth = await gasClient.sponsorTransaction(simpleTx);
		res.json({
			sponsorAuthenticator: sponsorAuth.bcsToHex().toString(),
			simpleTx: simpleTx.bcsToHex().toString(),
		});
	} catch (error) {
		console.error("Error archiving artifact:", error);
		res.status(500).json({ error: "Failed to archive artifact" });
	}
});

app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

async function buildSimpleMoveCallTransaction(
	sender: AccountAddress,
	artifact: Artifact
): Promise<SimpleTransaction> {
	return await movementClient.transaction.build.simple({
		sender,
		withFeePayer: true,
		data: {
			function: `${AccountAddress.from(
				PACKAGE_ID
			)}::gallery::upload_artifact`,
			functionArguments: [
				new MoveString(artifact.id),
				new MoveString(artifact.title),
				artifact.year,
				new MoveString(artifact.description),
				new MoveString(artifact.imageUrl),
			],
		},
		options: { expireTimestamp: Math.floor(Date.now() / 1000) + 5 * 60 },
	});
}
