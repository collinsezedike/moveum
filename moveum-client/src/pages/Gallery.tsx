import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import ArtifactDetail from "../components/ArtifactDetail";
import GalleryCarousel, { type Artifact } from "../components/GalleryCarousel";
import { useMovementConnection } from "../hooks/useMovementConnection";

export default function Gallery() {
	const navigate = useNavigate();
	const { isConnected } = useMovementConnection();
	const [artifacts, setArtifacts] = useState<Artifact[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
		null
	);

	useEffect(() => {
		if (!isConnected) {
			navigate("/gate");
			return;
		}
	}, [isConnected, navigate]);

	useEffect(() => {
		setLoading(true);

		const artifactsJSON = localStorage.getItem("artifacts");
		if (!artifactsJSON) {
			navigate("/gate");
			return;
		}
		console.log({ artifactsJSON });
		console.log({ artifacts: JSON.parse(artifactsJSON) });
		setArtifacts(JSON.parse(artifactsJSON) || []);

		setLoading(false);
	}, []);

	const handleArtifactClick = (artifact: Artifact) => {
		setSelectedArtifact(artifact);
	};

	const handleCloseDetail = () => {
		setSelectedArtifact(null);
	};

	if (loading && !artifacts) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-500 animate-pulse">
					Loading gallery...
				</p>
			</div>
		);
	} else {
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
}
