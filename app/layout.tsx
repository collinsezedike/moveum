import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-h-screen font-sans">
				<Theme appearance="inherit" radius="large" scaling="100%">
					{children}
					<ToastContainer
						position="top-right"
						autoClose={3000}
						newestOnTop
						closeOnClick
						pauseOnHover
					/>
				</Theme>
			</body>
		</html>
	);
}
