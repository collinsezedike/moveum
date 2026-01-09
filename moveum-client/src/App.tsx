import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Gate from "./pages/Gate";

const App: React.FC = () => {
	return (
		<Router>
			<main className="min-h-screen font-inter bg-gray-50">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/gallery" element={<Gallery />} />
					<Route path="/about" element={<About />} />
					<Route path="/gate" element={<Gate />} />
				</Routes>
			</main>
		</Router>
	);
};

export default App;
