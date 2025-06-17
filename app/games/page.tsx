"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button, ButtonLink } from "../../components/ui/button"
import { gameService, Game, GameStatus } from "../../lib/game-service"
// Import formatDate when needed for displaying dates
// import { formatDate } from "../../lib/utils"

// Helper function to get status class names with more vibrant colors
const getStatusClassName = (status: GameStatus): string => {
	switch (status) {
		case "COMPLETED":
			return "bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm"
		case "PLAYING":
			return "bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm"
		case "WISHLIST":
			return "bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm"
		case "DROPPED":
			return "bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm"
		default:
			return "bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm"
	}
}

// Helper function to translate status text to Portuguese
const getStatusText = (status: GameStatus): string => {
	switch (status) {
		case "COMPLETED":
			return "Concluído"
		case "PLAYING":
			return "Jogando"
		case "WISHLIST":
			return "Lista de Desejos"
		case "DROPPED":
			return "Abandonado"
		case "NOT_STARTED":
			return "Não Iniciado"
		default:
			return status
	}
}

export default function Games() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const statusFilter = searchParams.get("status")
	const favoriteFilter = searchParams.get("favorite") === "true"

	const [games, setGames] = useState<Game[]>([])
	const [filteredGames, setFilteredGames] = useState<Game[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState("")

	// Filters
	const [statusSelected, setStatusSelected] = useState<GameStatus | "ALL">(
		(statusFilter as GameStatus) || "ALL"
	)
	const [favoritesOnly, setFavoritesOnly] = useState(favoriteFilter)
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
		const fetchGames = async () => {
			try {
				// Skip request if we're not authenticated
				if (
					typeof window !== "undefined" &&
					!localStorage.getItem("authToken")
				) {
					return
				}

				const gamesData = await gameService.getAllGames()
				setGames(gamesData)
			} catch (err) {
				console.error("Erro ao buscar jogos:", err)
				setError(
					"Falha ao carregar jogos. Por favor, tente novamente mais tarde."
				)
			} finally {
				setLoading(false)
			}
		}

		fetchGames()
	}, [router])

	// Apply filters and search
	useEffect(() => {
		let result = [...games]

		// Apply status filter
		if (statusSelected !== "ALL") {
			result = result.filter((game) => game.status === statusSelected)
		}

		// Apply favorites filter
		if (favoritesOnly) {
			result = result.filter((game) => game.favorite)
		}

		// Apply search term
		if (searchTerm) {
			const searchTermLower = searchTerm.toLowerCase()
			result = result.filter(
				(game) =>
					game.name.toLowerCase().includes(searchTermLower) ||
					game.developer?.toLowerCase().includes(searchTermLower) ||
					game.description?.toLowerCase().includes(searchTermLower) ||
					game.genres?.some((genre) =>
						genre.toLowerCase().includes(searchTermLower)
					) ||
					game.tags?.some((tag) =>
						tag.toLowerCase().includes(searchTermLower)
					)
			)
		}

		setFilteredGames(result)
	}, [games, statusSelected, favoritesOnly, searchTerm])

	// Update URL params when filters change
	useEffect(() => {
		const params = new URLSearchParams()
		if (statusSelected !== "ALL") {
			params.set("status", statusSelected)
		}
		if (favoritesOnly) {
			params.set("favorite", "true")
		}

		// Update URL without refreshing the page
		const newUrl = `${window.location.pathname}${
			params.toString() ? "?" + params.toString() : ""
		}`
		window.history.replaceState(null, "", newUrl)
	}, [statusSelected, favoritesOnly])

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gaming-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">
						Carregando seus jogos...
					</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
					<p>{error}</p>
				</div>{" "}
				<Button onClick={() => window.location.reload()}>
					Tentar Novamente
				</Button>
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
					{" "}
					<h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
						Seus Jogos
					</h1>
					<ButtonLink href="/games/add" variant="default">
						Adicionar Novo Jogo
					</ButtonLink>
				</div>

				{/* Search and Filters */}
				<div className="bg-gray-50 p-4 rounded-lg mb-6">
					<div className="mb-4">
						{" "}
						<label htmlFor="search" className="sr-only">
							Buscar jogos
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg
									className="h-5 w-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
								</svg>
							</div>
							<input
								type="text"
								id="search"
								className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500"
								placeholder="Buscar por nome, desenvolvedor, gênero ou tag"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							{" "}
							<label
								htmlFor="status-filter"
								className="block text-sm font-medium text-gray-700 mb-1">
								Status
							</label>
							<select
								id="status-filter"
								className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gaming-500 focus:border-gaming-500"
								value={statusSelected}
								onChange={(e) =>
									setStatusSelected(
										e.target.value as GameStatus | "ALL"
									)
								}>
								{" "}
								<option value="ALL">Todos os Status</option>
								<option value="WISHLIST">
									Lista de Desejos
								</option>
								<option value="PLAYING">Jogando</option>
								<option value="COMPLETED">Concluído</option>
								<option value="DROPPED">Abandonado</option>
							</select>
						</div>

						<div className="flex items-center h-full mt-6 md:mt-0">
							<label className="inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									className="sr-only peer"
									checked={favoritesOnly}
									onChange={() =>
										setFavoritesOnly(!favoritesOnly)
									}
								/>
								<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gaming-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-600"></div>{" "}
								<span className="ml-3 text-sm font-medium text-gray-700">
									Apenas Favoritos
								</span>
							</label>
						</div>
					</div>
				</div>

				{/* Games List */}
				{filteredGames.length === 0 ? (
					<div className="bg-gray-50 p-8 text-center rounded-md">
						<svg
							className="mx-auto h-12 w-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
						</svg>{" "}
						<p className="mt-4 text-lg font-medium text-gray-900">
							Nenhum jogo encontrado
						</p>
						<p className="mt-2 text-gray-500">
							{games.length === 0
								? "Você ainda não adicionou nenhum jogo à sua biblioteca."
								: "Tente ajustar seus filtros ou termo de busca."}
						</p>
						{games.length === 0 && (
							<ButtonLink
								href="/games/add"
								className="mt-4 text-gray-900">
								Adicionar Seu Primeiro Jogo
							</ButtonLink>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredGames.map((game) => (
							<div
								key={game.id}
								className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
								{" "}								<div className="h-40 bg-gradient-to-r from-gaming-600 to-gaming-800 flex items-center justify-center relative">
									{game.imageUrl ? (
										<Image 
											src={game.imageUrl} 
											alt={`Capa de ${game.name}`}
											className="object-cover"
											fill 
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											priority={false}
										/>
									) : (
										<span className="text-white font-bold text-4xl bg-gaming-700/50 w-20 h-20 flex items-center justify-center rounded-full border-2 border-white/30">
											{game.name.substring(0, 1)}
										</span>
									)}
								</div>
								<div className="p-4">
									<h3 className="font-bold text-xl mb-1 text-gaming-800">
										{game.name}
									</h3>
									<div className="flex items-center text-sm text-gray-600 mb-3">
										{game.developer && (
											<span className="mr-3">
												{game.developer}
											</span>
										)}
										{game.hoursPlayed !== undefined && (
											<span>
												{game.hoursPlayed} horas jogadas
											</span>
										)}
									</div>{" "}
									<div className="flex flex-wrap gap-2 mb-3">
										{game.genres
											?.slice(0, 3)
											.map((genre) => (
												<span
													key={`genre-${game.id}-${genre}`}
													className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full shadow-sm font-medium">
													{genre}
												</span>
											))}
									</div>
									<div className="flex items-center justify-between">
										{/* Extract status styling logic */}{" "}
										<span
											className={getStatusClassName(
												game.status
											)}>
											{getStatusText(game.status)}
										</span>
										{game.favorite && (
											<span className="text-yellow-500">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="currentColor"
													viewBox="0 0 24 24">
													<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
												</svg>
											</span>
										)}
									</div>{" "}
									<ButtonLink
										href={`/games/${game.id}`}
										className="mt-3 w-full text-black"
										variant="outline"
										size="sm">
										<p>Ver Detalhes</p>
									</ButtonLink>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
