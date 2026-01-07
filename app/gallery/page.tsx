"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Header from "../../components/Header";
import GalleryCarousel from "../../components/GalleryCarousel";
import ArtifactDetail from "../../components/ArtifactDetail";
import { Artifact } from "../../components/GalleryCarousel";

export default function Gallery() {
	const [artifacts, setArtifacts] = useState<Artifact[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
		null
	);

	useEffect(() => {
		const fetchArtifacts = async () => {
			try {
				const response = await fetch("/api/artifacts");
				const data = await response.json();
				setArtifacts(data.artifacts || []);
			} catch (error) {
				console.error("Error fetching artifacts:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchArtifacts();
	}, []);

	const handleArtifactClick = (artifact: Artifact) => {
		setSelectedArtifact(artifact);
	};

	const handleCloseDetail = () => {
		setSelectedArtifact(null);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-500 animate-pulse">
					Loading gallery...
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<Header />

			<main className="pt-20">
				<GalleryCarousel
					artifacts={artifacts}
					onArtifactClick={handleArtifactClick}
				/>
			</main>

			<AnimatePresence>
				{selectedArtifact && (
					<ArtifactDetail
						artifact={selectedArtifact}
						onClose={handleCloseDetail}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
