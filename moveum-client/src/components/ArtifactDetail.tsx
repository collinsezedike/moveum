import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import type { Artifact } from "./GalleryCarousel";

interface ArtifactDetailProps {
	artifact: Artifact;
	onClose: () => void;
}

const ArtifactDetail: React.FC<ArtifactDetailProps> = ({
	artifact,
	onClose,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-stone-950 z-[60] flex items-center justify-center overflow-hidden"
		>
			<button
				onClick={onClose}
				className="absolute top-10 right-10 p-4 text-white/50 hover:text-white transition-colors z-[80]"
			>
				<X size={32} strokeWidth={1} />
			</button>

			{/* Image Backdrop */}
			<motion.div
				layoutId={`artifact-image-${artifact.id}`}
				className="absolute inset-0 z-10"
			>
				<motion.div
					initial={{ scale: 0.1 }}
					animate={{ scale: 1 }}
					transition={{ duration: 1.5 }}
					className="w-full h-full"
				>
					<img
						src={artifact.imageUrl}
						alt={artifact.title}
						className="w-full h-full object-cover opacity-40 grayscale-[0.2]"
					/>
				</motion.div>
				<div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#0c0a09_100%)]" />
			</motion.div>

			{/* Text */}
			<div className="relative z-50 w-full max-w-5xl h-full flex flex-col items-center justify-center px-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: -40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 2 }}
				>
					<p className="text-white/40 uppercase tracking-[0.8em] text-[10px] font-bold mb-6">
						{artifact.year}
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
					animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
					transition={{ duration: 1, delay: 1.2 }}
					className="mb-16"
				>
					<h1 className="text-6xl md:text-8xl font-serif text-white tracking-tighter mb-8 italic">
						{artifact.title}
					</h1>
					<p className="text-lg md:text-xl text-stone-300 font-light leading-relaxed max-w-2xl mx-auto italic opacity-80">
						{artifact.description}
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 2 }}
					className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-10 w-full max-w-3xl"
				>
					{[
						{ label: "Medium", value: "Curated Digitization" },
						{ label: "Provenance", value: "Permanent Collection" },
						{ label: "Status", value: "Authenticated" },
					].map((spec, i) => (
						<div key={i} className="flex flex-col items-center">
							<span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2">
								{spec.label}
							</span>
							<span className="text-stone-200 font-serif text-sm">
								{spec.value}
							</span>
						</div>
					))}
				</motion.div>
			</div>
		</motion.div>
	);
};

export default ArtifactDetail;
