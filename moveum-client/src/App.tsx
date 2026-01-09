import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Gate from "./pages/Gate";

const App: React.FC = () => {
	return (
		<>
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 1500,
					style: {
						background: "white",
						borderRadius: "12px",
						fontFamily: "monospace",
						textTransform: "uppercase",
						letterSpacing: "0.1em",
						fontSize: "10px",
					},
				}}
			/>
			<BrowserRouter>
				<main className="min-h-screen font-inter bg-gray-50">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/gallery" element={<Gallery />} />
						<Route path="/about" element={<About />} />
						<Route path="/gate" element={<Gate />} />
					</Routes>
				</main>
			</BrowserRouter>
		</>
	);
};

export default App;
