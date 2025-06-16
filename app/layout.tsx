import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Import components
import { Navigation } from "../components/layout/navigation"
import { Footer } from "../components/layout/footer"
import { LayoutProvider } from "../components/layout/layout-provider"

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
})

export const metadata: Metadata = {
	title: "GameSync - Manage Your Gaming Library",
	description:
		"Manage your gaming library across multiple platforms in one place",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
				<LayoutProvider>
					<Navigation />
					<main className="flex-grow container mx-auto px-4 py-8">
						{children}
					</main>
					<Footer />
				</LayoutProvider>
			</body>
		</html>
	)
}
