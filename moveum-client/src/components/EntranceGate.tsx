import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

interface EntranceGateProps {
	onEnter: () => void;
}

const EntranceGate: React.FC<EntranceGateProps> = ({ onEnter }) => {
	const [isCut, setIsCut] = useState(false);

	const handleCut = () => {
		setIsCut(true);
		setTimeout(onEnter, 1600);
	};

	return (
		<motion.div
			className="fixed inset-0 bg-[#f7f5f2] flex items-center justify-center z-50 overflow-hidden"
			exit={{ opacity: 0, transition: { duration: 0.2 } }}
		>
			<div className="relative w-full h-screen flex items-center justify-center">
				{/* THE PILLARS */}
				<div className="absolute inset-x-0 md:inset-x-20 flex justify-between pointer-events-none z-20 h-full">
					{[1, 2].map((i) => (
						<div
							key={i}
							className="relative h-full flex flex-col items-center"
						>
							<div className="w-12 md:w-32 h-full bg-stone-900 relative">
								<div className="absolute inset-y-0 left-0 w-2 bg-stone-800" />
								<div className="absolute inset-y-0 right-0 w-2 bg-stone-950" />
								<div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
								<div className="absolute inset-y-0 left-1/4 w-[2px] bg-white/5" />
								<div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/5 -translate-x-1/2" />
							</div>
						</div>
					))}
				</div>

				{/* THE RIBBON */}
				<div className="absolute inset-x-20 h-16 md:h-24 flex pointer-events-none items-center z-10">
					<motion.div
						initial={{ scaleX: 1 }}
						animate={
							isCut
								? {
										scaleX: 0,
										x: -400,
										opacity: 0,
								  }
								: { scaleX: 1 }
						}
						transition={{ duration: 2, ease: [0.34, 1.3, 0.64, 1] }}
						className="flex-1 h-16 md:h-24 bg-red-700 origin-left"
					/>
					<motion.div
						initial={{ scaleX: 1 }}
						animate={
							isCut
								? {
										scaleX: 0,
										x: 400,
										opacity: 0,
								  }
								: { scaleX: 1 }
						}
						transition={{ duration: 2, ease: [0.34, 1.3, 0.64, 1] }}
						className="flex-1 h-16 md:h-24 bg-red-700 origin-right"
					/>
				</div>

				{/* THE SCISSORS */}
				<div className="relative z-30 mt-36 md:mt-48">
					<motion.button
						onClick={handleCut}
						disabled={isCut}
						initial={{ rotate: -30, y: -42 }}
						whileHover={
							!isCut ? { rotate: -15, y: -48, scale: 1.05 } : {}
						}
						whileTap={!isCut ? { rotate: 5, scale: 0.9 } : {}}
						animate={
							isCut
								? {
										y: 300,
										opacity: 0,
										transition: {
											duration: 0.7,
											ease: "easeIn",
										},
								  }
								: {}
						}
						className="flex flex-col items-center group cursor-pointer"
					>
						<Scissors
							size={96}
							strokeWidth={1}
							className={`transform drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-colors duration-700 ${
								isCut ? "text-red-950" : "text-stone-950"
							}`}
						/>
						<motion.span
							animate={isCut ? { opacity: 0 } : { opacity: 0.25 }}
							className="absolute -bottom-24 whitespace-nowrap text-[11px] uppercase tracking-[0.8em] text-stone-700 font-black"
						>
							Open Gallery
						</motion.span>
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
};

export default EntranceGate;
