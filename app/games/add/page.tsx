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
			if (!data.name) {
				toast({
					title: "Validation Error",
					description: "Game name is required",
					variant: "destructive",
				})
				throw new Error("Game name is required")
			}

			// Log the data being sent to the server to help with debugging
			console.log("Submitting game data:", JSON.stringify(data))

			// Cast to GameCreateDTO since we know we're creating a new game
			const gameData = data as GameCreateDTO
			const newGame = await gameService.createGame(gameData)

			toast({
				title: "Success",
				description: "Game created successfully!",
				variant: "default",
			})

			router.push(`/games/${newGame.id}`)
		} catch (err) {
			console.error("Error creating game:", err)

			// Get more detailed error information
			let errorMessage = "Failed to create game. Please try again."
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
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="max-w-4xl mx-auto my-8 px-4">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">
					Add New Game
				</h1>
				<p className="text-gray-600 mt-2">
					Create a new game in your library. Fill in the details
					below.
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
