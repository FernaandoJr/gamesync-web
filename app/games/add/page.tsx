"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
	gameService,
	GameCreateDTO,
	GameUpdateDTO,
} from "../../../lib/game-service"
import { useToast } from "../../../components/ui/use-toast"
import GameForm from "../../../components/games/game-form"
import DebugGameStatus from "./debug-status"

export default function AddGame() {
	const router = useRouter()
	const { toast } = useToast()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		// Check if user is authenticated
		if (
			typeof window !== "undefined" &&
			!localStorage.getItem("authToken")
		) {
			router.push("/login")
		}
	}, [router])

	const handleSubmit = async (data: GameCreateDTO | GameUpdateDTO) => {
		setIsLoading(true)

		try {
			// Since we're adding a new game, we need to ensure we have a name property
			if (!data.name) {				toast({
					title: "Erro de Validação",
					description: "Nome do jogo é obrigatório",
					variant: "destructive",
				})
				throw new Error("Nome do jogo é obrigatório")
			}

			// Log the data being sent to the server to help with debugging
			console.log("Submitting game data:", JSON.stringify(data))			// Cast to GameCreateDTO since we know we're creating a new game
			const gameData = data as GameCreateDTO
			const newGame = await gameService.createGame(gameData)
			
			toast({
				title: "Sucesso",
				description: "Jogo criado com sucesso!",
				variant: "default",
			})

			router.push(`/games/${newGame.id}`)
		} catch (err) {
			console.error("Erro ao criar jogo:", err)			// Get more detailed error information
			let errorMessage = "Falha ao criar jogo. Por favor, tente novamente."
			if (err instanceof Error) {
				errorMessage = err.message
			} else if (err && typeof err === "object" && "response" in err) {
				const axiosError = err as {
					response?: { data?: { message?: string } }
				}
				errorMessage =
					axiosError.response?.data?.message ?? errorMessage
			}

			toast({
				title: "Erro",
				description: errorMessage,
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="max-w-4xl mx-auto my-8 px-4">			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					Adicionar Novo Jogo
				</h1>
				<p className="text-gray-600 mt-2">
					Crie um novo jogo em sua biblioteca. Preencha os detalhes
					abaixo.
				</p>
			</div>{" "}
			<GameForm
				onSubmit={handleSubmit}
				isLoading={isLoading}
				isEditing={false}
			/>
			{/* Add this component to debug GameStatus values */}
			<DebugGameStatus />
		</div>
	)
}
