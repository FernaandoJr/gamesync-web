"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button, ButtonLink } from "../../components/ui/button"
import { gameService, Game, GameStatus } from "../../lib/game-service"
import { userService, User } from "../../lib/user-service"

export default function Dashboard() {
	const router = useRouter()
	const [user, setUser] = useState<User | null>(null)
	const [games, setGames] = useState<Game[]>([])
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
		const fetchData = async () => {
			try {
				// Skip request if we're not authenticated
				if (
					typeof window !== "undefined" &&
					!localStorage.getItem("authToken")
				) {
					return
				}

				// Fetch user profile
				const userData = await userService.getCurrentUser()
				setUser(userData)

				// Fetch user's games
				const gamesData = await gameService.getAllGames()
				setGames(gamesData)
			} catch (err) {
				console.error("Error fetching dashboard data:", err)
				setError(
					"Falha ao carregar os dados do painel. Por favor, tente novamente mais tarde."
				)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [router])

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				{" "}
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gaming-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">
						Carregando seu mundo de jogos...
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
				{" "}
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Bem-vindo, {user?.username ?? "Gamer"}!
				</h1>
				<p className="text-gray-600">
					Gerencie sua coleção de jogos e acompanhe seu progresso
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center justify-between mb-4">
						{" "}
						<h2 className="text-xl font-bold text-gray-900">
							Sua Biblioteca
						</h2>
						<span className="bg-gaming-100 text-gaming-800 text-sm font-medium px-3 py-1 rounded-full">
							{games.length} Jogos
						</span>
					</div>
					<p className="text-gray-600 mb-4">
						Gerencie sua coleção de jogos em todas as plataformas.
					</p>
					<ButtonLink href="/games" variant="outline">
						Ver Todos os Jogos
					</ButtonLink>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center justify-between mb-4">
						{" "}
						<h2 className="text-xl font-bold text-gray-900">
							Em Andamento
						</h2>
						<span className="bg-gaming-100 text-gaming-800 text-sm font-medium px-3 py-1 rounded-full">
							{
								games.filter(
									(game) => game.status === GameStatus.PLAYING
								).length
							}{" "}
							Jogos
						</span>
					</div>
					<p className="text-gray-600 mb-4">
						Jogos que você está jogando atualmente.
					</p>
					<ButtonLink href="/games?status=PLAYING" variant="outline">
						Ver Em Andamento
					</ButtonLink>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center justify-between mb-4">
						{" "}
						<h2 className="text-xl font-bold text-gray-900">
							Favoritos
						</h2>
						<span className="bg-gaming-100 text-gaming-800 text-sm font-medium px-3 py-1 rounded-full">
							{games.filter((game) => game.favorite).length} Jogos
						</span>
					</div>
					<p className="text-gray-600 mb-4">
						Seus jogos mais amados.
					</p>
					<ButtonLink href="/games?favorite=true" variant="outline">
						Ver Favoritos
					</ButtonLink>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<div className="flex items-center justify-between mb-4">
					{" "}
					<h2 className="text-xl font-bold text-gray-900">
						Jogos Recentes
					</h2>
					<ButtonLink href="/games/add" variant="default" size="sm">
						Adicionar Jogo
					</ButtonLink>
				</div>

				{games.length === 0 ? (
					<div className="bg-gray-50 p-6 text-center rounded-md">
						<p className="text-gray-500 mb-4">
							Você ainda não adicionou nenhum jogo à sua
							biblioteca.
						</p>
						<ButtonLink href="/games/add">
							Adicionar Seu Primeiro Jogo
						</ButtonLink>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{games.slice(0, 3).map((game) => (
							<div
								key={game.id}
								className="border border-gray-200 rounded-lg overflow-hidden">
								<div className="h-32 bg-gaming-100 flex items-center justify-center">
									{/* Game image would go here if available */}
									<span className="text-gaming-700 font-bold text-xl">
										{game.name.substring(0, 1)}
									</span>
								</div>
								<div className="p-4">
									<h3 className="font-bold text-lg mb-1">
										{game.name}
									</h3>
									<div className="flex items-center text-sm text-gray-600 mb-2">
										{game.developer && (
											<span className="mr-3">
												{game.developer}
											</span>
										)}{" "}
										{game.hoursPlayed && (
											<span>
												{game.hoursPlayed} horas jogadas
											</span>
										)}
									</div>
									<div className="flex items-center justify-between">
										{" "}
										{(() => {
											let statusClass
											let statusText = ""

											switch (game.status) {
												case GameStatus.COMPLETED:
													statusClass =
														"bg-green-100 text-green-800"
													statusText = "Concluído"
													break
												case GameStatus.PLAYING:
													statusClass =
														"bg-blue-100 text-blue-800"
													statusText = "Jogando"
													break
												case GameStatus.WISHLIST:
													statusClass =
														"bg-yellow-100 text-yellow-800"
													statusText =
														"Lista de Desejos"
													break
												case GameStatus.DROPPED:
													statusClass =
														"bg-red-100 text-red-800"
													statusText = "Abandonado"
													break
												case GameStatus.NOT_STARTED:
													statusClass =
														"bg-gray-100 text-gray-800"
													statusText = "Não Iniciado"
													break
												default:
													statusClass =
														"bg-gray-100 text-gray-800"
													statusText = String(
														game.status
													)
													break
											}

											return (
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
													{statusText}
												</span>
											)
										})()}
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
									</div>
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
