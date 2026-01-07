import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

async function getArtifactsData() {
	const filePath = path.join(
		process.cwd(),
		"app",
		"api",
		"artifacts",
		"artifacts.json"
	);
	const fileContents = await fs.readFile(filePath, "utf8");
	return JSON.parse(fileContents);
}

export async function GET() {
	try {
		const data = await getArtifactsData();
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to load artifacts" },
			{ status: 500 }
		);
	}
}
