"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { gameService, Game, GameStatus } from "../../../lib/game-service"
import { Button, ButtonLink } from "../../../components/ui/button"
import { useToast } from "../../../components/ui/use-toast"
import { formatDate } from "../../../lib/utils"

export default function GameDetails() {
	const router = useRouter()
	const { toast } = useToast()
	const { id } = useParams()
	const gameId = Array.isArray(id) ? id[0] : id

	const [game, setGame] = useState<Game | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	// Authentication check
	useEffect(() => {
		// Check if user is authenticated
		if (
			typeof window !== "undefined" &&
			!localStorage.getItem("authToken")
		) {
			router.push("/login")
		}
	}, [router])

	// Data fetching
	useEffect(() => {
		const fetchGame = async () => {
			try {
				// Skip request if we're not authenticated
				if (
					typeof window !== "undefined" &&
					!localStorage.getItem("authToken")
				) {
					return
				}

				if (!gameId) {
					setError("No game ID provided")
					setLoading(false)
					return
				}

				const gameData = await gameService.getGameById(gameId)
				setGame(gameData)
			} catch (err) {
				console.error("Error fetching game details:", err)
				setError("Failed to load game details. Please try again later.")
			} finally {
				setLoading(false)
			}
		}

		fetchGame()
	}, [gameId, router])
	const handleDeleteGame = async () => {
		if (!game) return

		if (
			window.confirm(
				"Are you sure you want to delete this game? This action cannot be undone."
			)
		) {
			try {
				await gameService.deleteGame(game.id)
				toast({
					title: "Game deleted",
					description: "The game has been successfully removed",
				})
				router.push("/games")
			} catch (err) {
				console.error("Error deleting game:", err)
				toast({
					title: "Delete failed",
					description: "Failed to delete game. Please try again.",
					variant: "destructive",
				})
			}
		}
	}
	const toggleFavorite = async () => {
		if (!game) return

		try {
			const updatedGame = await gameService.updateGame(game.id, {
				favorite: !game.favorite,
			})
			setGame(updatedGame)
			toast({
				title: game.favorite
					? "Removed from favorites"
					: "Added to favorites",
				description: `${game.name} has been ${
					game.favorite ? "removed from" : "added to"
				} your favorites`,
			})
		} catch (err) {
			console.error("Error updating favorite status:", err)
			toast({
				title: "Update failed",
				description:
					"Failed to update favorite status. Please try again.",
				variant: "destructive",
			})
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gaming-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">
						Loading game details...
					</p>
				</div>
			</div>
		)
	}

	if (error || !game) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
					<p>{error ?? "Game not found"}</p>
				</div>{" "}
				<Button onClick={() => router.push("/games")}>
					Return to Games
				</Button>
			</div>
		)
	} // Using imported formatDate utility from lib/utils.ts
	// Map status to display text and style with vibrant colors
	const getStatusInfo = (status: GameStatus) => {
		const statusMap: Record<
			GameStatus,
			{ label: string; bgColor: string; textColor: string }
		> = {
			[GameStatus.COMPLETED]: {
				label: "Completed",
				bgColor: "bg-green-500",
				textColor: "text-white",
			},
			[GameStatus.PLAYING]: {
				label: "Playing",
				bgColor: "bg-blue-500",
				textColor: "text-white",
			},
			[GameStatus.WISHLIST]: {
				label: "Wishlist",
				bgColor: "bg-purple-500",
				textColor: "text-white",
			},
			[GameStatus.DROPPED]: {
				label: "Dropped",
				bgColor: "bg-red-500",
				textColor: "text-white",
			},
		}
		return (
			statusMap[status] ?? {
				label: String(status),
				bgColor: "bg-gray-100",
				textColor: "text-gray-800",
			}
		)
	}

	const statusInfo = getStatusInfo(game.status)

	return (
		<div className="max-w-5xl mx-auto my-8 px-4">
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Header section */}
				<div className="p-6 bg-gradient-to-r from-gaming-700 to-gaming-900 text-white">
					<div className="flex justify-between items-start">
						<div>
							<h1 className="text-3xl font-bold mb-2">
								{game.name}
							</h1>
							{game.developer && (
								<p className="text-gray-200 text-lg">
									{game.developer}
								</p>
							)}
						</div>

						<div className="flex space-x-3">
							<button
								onClick={toggleFavorite}
								className={`p-2 rounded-full ${
									game.favorite
										? "bg-yellow-500 text-white"
										: "bg-white/10 text-white hover:bg-white/20"
								} transition`}
								aria-label={
									game.favorite
										? "Remove from favorites"
										: "Add to favorites"
								}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill={
										game.favorite ? "currentColor" : "none"
									}
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
				{/* Main content */}
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Left column */}
						<div className="col-span-2">
							<section className="mb-8">
								<h2 className="text-xl font-semibold mb-3 text-gray-800">
									Description
								</h2>
								<p className="text-gray-700 whitespace-pre-line">
									{" "}
									{game.description ??
										"No description available."}
								</p>
							</section>

							<section className="mb-8">
								<h2 className="text-xl font-semibold mb-3 text-gray-800">
									Details
								</h2>
								<div className="bg-gray-50 p-4 rounded-lg space-y-3">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<h3 className="text-sm font-medium text-gray-500">
												Status
											</h3>
											<span
												className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${statusInfo.bgColor} ${statusInfo.textColor}`}>
												{statusInfo.label}
											</span>
										</div>
										{game.hoursPlayed !== undefined && (
											<div>
												<h3 className="text-sm font-medium text-gray-500">
													Hours Played
												</h3>
												<p className="mt-1 text-gray-900">
													{game.hoursPlayed} hours
												</p>
											</div>
										)}
										<div>
											<h3 className="text-sm font-medium text-gray-500">
												Source
											</h3>
											<p className="mt-1 text-gray-900">
												{game.source}
											</p>
										</div>{" "}
										<div>
											<h3 className="text-sm font-medium text-gray-500">
												Added On
											</h3>
											<p className="mt-1 text-gray-900">
												{" "}
												{formatDate(
													game.addedAt ??
														game.createdAt,
													"full"
												)}
											</p>
										</div>
									</div>
								</div>
							</section>
						</div>

						{/* Right column */}
						<div>
							<section className="mb-8">
								<h2 className="text-xl font-semibold mb-3 text-gray-800">
									Tags & Categories
								</h2>
								<div className="bg-gray-50 p-4 rounded-lg">
									{game.genres && game.genres.length > 0 && (
										<div className="mb-4">
											<h3 className="text-sm font-medium text-gray-500 mb-2">
												Genres
											</h3>{" "}
											<div className="flex flex-wrap gap-2">
												{game.genres.map((genre) => (
													<span
														key={`genre-${genre}`}
														className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">
														{genre}
													</span>
												))}
											</div>
										</div>
									)}

									{game.tags && game.tags.length > 0 && (
										<div className="mb-4">
											<h3 className="text-sm font-medium text-gray-500 mb-2">
												Tags
											</h3>{" "}
											<div className="flex flex-wrap gap-2">
												{game.tags.map((tag) => (
													<span
														key={`tag-${tag}`}
														className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
														{tag}
													</span>
												))}
											</div>
										</div>
									)}

									{game.platforms &&
										game.platforms.length > 0 && (
											<div>
												<h3 className="text-sm font-medium text-gray-500 mb-2">
													Platforms
												</h3>{" "}
												<div className="flex flex-wrap gap-2">
													{game.platforms.map(
														(platform) => (
															<span
																key={`platform-${platform}`}
																className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">
																{platform}
															</span>
														)
													)}
												</div>
											</div>
										)}
								</div>
							</section>
						</div>
					</div>
				</div>{" "}
				{/* Actions footer */}
				<div className="border-t border-gray-200 p-6 bg-gray-50 flex flex-wrap gap-4">
					<ButtonLink href="/games" variant="outline">
						Back to Games
					</ButtonLink>
					<ButtonLink
						href={`/games/${game.id}/edit`}
						variant="secondary">
						Edit Game
					</ButtonLink>
					<Button
						variant="destructive"
						onClick={handleDeleteGame}
						className="ml-auto cursor-pointer">
						Delete Game
					</Button>
				</div>
			</div>
		</div>
	)
}
