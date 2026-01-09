import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function truncateAddress(
	address: string,
	startChars: number = 6,
	endChars: number = 4
): string {
	if (!address) return "";
	if (address.length <= startChars + endChars) return address;

	return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
