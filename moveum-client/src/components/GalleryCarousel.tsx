import React, { useState } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";

export interface Artifact {
	id: number;
	title: string;
	year: number;
	description: string;
	imageUrl: string;
}

interface GalleryCarouselProps {
	artifacts: Artifact[];
	onArtifactClick: (artifact: Artifact) => void;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({
	artifacts,
	onArtifactClick,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleNext = () =>
		setCurrentIndex((prev) => (prev + 1) % artifacts.length);
	const handlePrev = () =>
		setCurrentIndex(
			(prev) => (prev - 1 + artifacts.length) % artifacts.length
		);

	const springConfig: Transition = {
		type: "spring",
		stiffness: 40,
		damping: 20,
		mass: 1,
	};

	return (
		<div className="fixed inset-0 w-full h-screen bg-white overflow-hidden flex flex-col pt-32 pb-12">
			<div
				className="absolute left-0 top-0 w-[30%] h-full z-40 cursor-pointer"
				onClick={handlePrev}
			/>
			<div
				className="absolute right-0 top-0 w-[30%] h-full z-40 cursor-pointer"
				onClick={handleNext}
			/>

			<div className="relative flex-grow flex items-center justify-center perspective-[2000px]">
				{artifacts?.map((artifact, index) => {
					let offset = index - currentIndex;

					if (offset > artifacts.length / 2)
						offset -= artifacts.length;
					if (offset < -artifacts.length / 2)
						offset += artifacts.length;

					const isCenter = index === currentIndex;
					const isVisible = Math.abs(offset) <= 1;

					return (
						<motion.div
							key={artifact?.id}
							initial={{
								opacity: 0,
								y: 60,
								filter: "blur(10px)",
							}}
							animate={{
								opacity: isCenter ? 1 : isVisible ? 0.2 : 0,
								y: 0,
								filter: "blur(0px)",
								x:
									offset *
									(typeof window !== "undefined" &&
									window.innerWidth < 768
										? 140
										: 380),
								rotateY: offset * -25,
								scale: isCenter ? 1 : 0.6,
								z: isCenter ? 0 : -400,
							}}
							transition={{
								opacity: {
									duration: 2,
									ease: [0.22, 1, 0.36, 1],
								},
								y: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
								filter: { duration: 2.5 },
								default: springConfig,
							}}
							onClick={(e: any) => {
								e.stopPropagation();
								if (isCenter) onArtifactClick(artifact);
								else if (offset === -1) handlePrev();
								else if (offset === 1) handleNext();
							}}
							className={`absolute w-[220px] md:w-[320px] aspect-[3/4] select-none cursor-pointer ${
								isCenter ? "z-50" : "z-10"
							}`}
						>
							<div className="w-full h-full rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-stone-100">
								<img
									src={artifact?.imageUrl}
									alt={artifact?.title}
									className="w-full h-full object-cover pointer-events-none"
								/>
							</div>
						</motion.div>
					);
				})}
			</div>

			<div className="w-full flex flex-col items-center z-50 pointer-events-none">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{
							duration: 1.5,
							ease: [0.22, 1, 0.36, 1],
							delay: 0.5,
						}}
						className="text-center"
					>
						<h2 className="text-stone-900 text-2xl md:text-4xl font-serif tracking-tight leading-none">
							{artifacts[currentIndex]?.title}
						</h2>
						<p className="text-stone-400 uppercase tracking-[0.5em] text-[10px] font-bold mt-1">
							{artifacts[currentIndex]?.year}
						</p>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};

export default GalleryCarousel;
