"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { gameService, Game, GameUpdateDTO } from "../../../../lib/game-service"
import GameForm from "../../../../components/games/game-form"
import { useToast } from "../../../../components/ui/use-toast"

export default function EditGame() {
	const router = useRouter()
	const { toast } = useToast()
	const { id } = useParams()
	const gameId = Array.isArray(id) ? id[0] : id

	const [game, setGame] = useState<Game | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isFetching, setIsFetching] = useState(true)
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

	// Fetch the game to edit
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
					setError("ID do jogo não fornecido")
					setIsFetching(false)
					return
				}

				const gameData = await gameService.getGameById(gameId)
				setGame(gameData)
			} catch (err) {				console.error("Erro ao buscar detalhes do jogo:", err)
				setError("Falha ao carregar detalhes do jogo. Por favor, tente novamente mais tarde.")
			} finally {
				setIsFetching(false)
			}
		}

		fetchGame()
	}, [gameId, router])
	// Handle form submission
	const handleSubmit = async (data: GameUpdateDTO) => {
		setIsLoading(true)

		try {
			if (!gameId) {
				throw new Error("ID do jogo não fornecido")
			}

			const updatedGame = await gameService.updateGame(gameId, data)
			toast({
				title: "Jogo atualizado",
				description: "Detalhes do jogo foram atualizados com sucesso.",
			})
			router.push(`/games/${updatedGame.id}`)
		} catch (err) {			console.error("Erro ao atualizar jogo:", err)
			toast({
				title: "Falha na atualização",
				description: "Falha ao atualizar jogo. Por favor, tente novamente.",
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	if (isFetching) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gaming-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Carregando dados do jogo...</p>
				</div>
			</div>
		)
	}

	if (error || !game) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
					<p>{error ?? "Jogo não encontrado"}</p>
				</div>
				<button
					className="px-4 py-2 bg-gaming-600 text-white rounded-md hover:bg-gaming-700"
					onClick={() => router.push("/games")}>
					Voltar para Jogos
				</button>
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto my-8 px-4">
			<div className="mb-6">				<h1 className="text-3xl font-bold text-gray-900">Editar Jogo</h1>
				<p className="text-gray-600 mt-2">
					Atualize os detalhes para {game.name}.
				</p>
			</div>

			<GameForm
				game={game}
				onSubmit={handleSubmit}
				isLoading={isLoading}
				isEditing={true}
			/>
		</div>
	)
}
