"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Button, ButtonLink } from "../ui/button"
import { Menu, X } from "lucide-react"

export function Navigation({
	className,
	...props
}: Readonly<React.HTMLAttributes<HTMLElement>>) {
	const pathname = usePathname()
	const [isLoggedIn, setIsLoggedIn] = React.useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

	// Check auth status on client-side after mount
	React.useEffect(() => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("authToken")
			setIsLoggedIn(!!token)
		}
	}, [])

	const handleSignOut = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("authToken")
			window.location.href = "/"
		}
	}
	// Define navigation links
	const navLinks = [
		{ href: "/", label: "Início" },
		{ href: "/games", label: "Jogos" },
		{ href: "/profile", label: "Perfil" },
	]

	// Helper to check if a path is active
	const isActive = (path: string) => {
		if (path === "/") return pathname === "/"
		return pathname === path || pathname.startsWith(`${path}/`)
	}

	return (
		<nav
			className={cn(
				"bg-white border-b px-4 lg:px-6 py-2.5 sticky top-0 z-100",
				className
			)}
			{...props}>
			<div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
				<Link href="/" className="flex items-center">
					<span className="self-center text-xl font-semibold whitespace-nowrap text-gaming-700">
						GameSync
					</span>
				</Link>

				{/* Mobile menu button */}
				<div className="flex lg:hidden">
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-500"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label={
							isMobileMenuOpen ? "Close menu" : "Open menu"
						}>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</Button>
				</div>

				{/* Desktop navigation */}
				<div className="hidden lg:flex items-center gap-8">
					<div className="flex space-x-6">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"text-sm font-medium transition-colors",
									isActive(link.href)
										? "text-gaming-700 font-semibold"
										: "text-gray-600 hover:text-gaming-600"
								)}>
								{link.label}
							</Link>
						))}
					</div>

					<div className="flex items-center space-x-2">
						{!isLoggedIn ? (
							<>
								<ButtonLink
									href="/login"
									variant="outline"
									size="sm"
									className="border-gaming-600 text-gaming-600 hover:bg-gaming-50">
									Entrar
								</ButtonLink>
								<ButtonLink
									href="/register"
									variant="default"
									className="cursor-pointer !text-black"
									size="sm">
									Cadastre-se
								</ButtonLink>
							</>
						) : (
							<>
								<ButtonLink
									href="/dashboard"
									variant="ghost"
									size="sm">
									Painel
								</ButtonLink>
								<Button
									variant="outline"
									size="sm"
									className="cursor-pointer !text-black"
									onClick={handleSignOut}>
									Sair
								</Button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Mobile navigation */}
			{isMobileMenuOpen && (
				<div className="lg:hidden px-2 pt-2 pb-4 space-y-1 sm:px-3 border-t mt-2">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"block px-3 py-2 rounded-md text-base font-medium",
								isActive(link.href)
									? "bg-gaming-50 text-gaming-700"
									: "text-gray-700 hover:bg-gray-50 hover:text-gaming-600"
							)}
							onClick={() => setIsMobileMenuOpen(false)}>
							{link.label}
						</Link>
					))}
					<div className="mt-4 flex flex-col space-y-2 px-3">
						{!isLoggedIn ? (
							<>
								<ButtonLink
									href="/login"
									variant="outline"
									className="w-full justify-center">
									Entrar
								</ButtonLink>
								<ButtonLink
									href="/register"
									variant="default"
									className="w-full justify-center cursor-pointer !text-black">
									Cadastre-se
								</ButtonLink>
							</>
						) : (
							<>
								<ButtonLink
									href="/dashboard"
									variant="ghost"
									className="w-full justify-center">
									Painel
								</ButtonLink>
								<Button
									variant="outline"
									className="w-full justify-center cursor-pointer text-black"
									onClick={handleSignOut}>
									Sair
								</Button>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	)
}
