import { Link, useLocation } from "react-router-dom";
import { Copy, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useMovementConnection } from "../hooks/useMovementConnection";
import { WalletSelectionModal } from "./WalletSelectionModal";
import { truncateAddress } from "../lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown";

const Header = () => {
	const { pathname } = useLocation();
	const { isConnected, address, disconnect } = useMovementConnection();

	const copyAddress = () => {
		if (address) {
			navigator.clipboard.writeText(address.toString());
			toast.success("Address Copied");
		}
	};

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-stone-100">
			<nav className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<Link
						to="/"
						className="text-2xl font-serif font-semibold text-stone-900 tracking-tight"
					>
						MOVEUM
					</Link>

					<div className="flex items-center space-x-8">
						{isConnected && (
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 border border-stone-200 rounded-full hover:border-stone-900 transition-all outline-none cursor-pointer">
									<div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
									<span className="text-[10px] font-mono text-stone-600 uppercase">
										{truncateAddress(
											address?.toString() || ""
										)}
									</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-48 p-2 border-stone-200 rounded-xl shadow-xl"
								>
									<DropdownMenuItem
										onClick={copyAddress}
										className="flex items-center justify-between text-[10px] uppercase tracking-widest p-3 cursor-pointer rounded-lg"
									>
										Copy Address{" "}
										<Copy className="w-3 h-3" />
									</DropdownMenuItem>

									<WalletSelectionModal>
										<div className="relative flex cursor-pointer select-none items-center rounded-lg p-3 text-[10px] uppercase tracking-widest outline-none transition-colors hover:bg-stone-900 hover:text-white">
											Change Wallet{" "}
											<RefreshCw className="w-3 h-3 ml-auto" />
										</div>
									</WalletSelectionModal>

									<DropdownMenuItem
										onClick={disconnect}
										className="flex items-center justify-between text-[10px] uppercase tracking-widest p-3 cursor-pointer text-red-500 focus:text-white focus:bg-red-500 rounded-lg"
									>
										Disconnect{" "}
										<LogOut className="w-3 h-3" />
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						<div className="hidden md:flex items-center space-x-8">
							{["Home", "Gallery", "About"].map((item) => {
								const path =
									item === "Home"
										? "/"
										: `/${item.toLowerCase()}`;
								return (
									<Link
										key={item}
										to={path}
										className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors hover:text-stone-900 ${
											pathname === path
												? "text-stone-900"
												: "text-stone-400"
										}`}
									>
										{item}
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
