import { apiClient } from "./api-client"

export enum GameStatus {
	WISHLIST = "WISHLIST",
	PLAYING = "PLAYING",
	COMPLETED = "COMPLETED",
	DROPPED = "DROPPED",
	NOT_STARTED = "NOT_STARTED",
}

export enum GameSource {
	MANUAL = "MANUAL",
}

export interface Game {
	id: string
	name: string
	description?: string
	developer?: string
	userId: string
	imageUrl?: string
	hoursPlayed?: number
	favorite: boolean
	genres?: string[]
	tags?: string[]
	platforms?: string[]
	status: GameStatus
	source: GameSource
	createdAt: string
	updatedAt: string
	addedAt?: string // Additional field for API response compatibility
}

export interface GameCreateDTO {
	name: string
	description?: string
	developer?: string
	imageUrl?: string
	hoursPlayed?: number
	favorite: boolean
	genres?: string[]
	tags?: string[]
	platforms?: string[]
	status?: GameStatus
	source?: GameSource
}

export interface GameUpdateDTO {
	name?: string
	description?: string
	developer?: string
	imageUrl?: string
	hoursPlayed?: number
	favorite?: boolean
	genres?: string[]
	tags?: string[]
	platforms?: string[]
	status?: GameStatus
}

export const gameService = {
	// Create a new game
	createGame: async (gameData: GameCreateDTO) => {
		const response = await apiClient.post<Game>("/games", gameData)
		return response.data
	},

	// Get all games for current user
	getAllGames: async () => {
		const response = await apiClient.get<Game[]>("/games")
		return response.data
	},

	// Get game by ID
	getGameById: async (id: string) => {
		const response = await apiClient.get<Game>(`/games/${id}`)
		return response.data
	},

	// Update game
	updateGame: async (id: string, gameData: GameUpdateDTO) => {
		const response = await apiClient.put<Game>(`/games/${id}`, gameData)
		return response.data
	},

	// Delete game
	deleteGame: async (id: string) => {
		const response = await apiClient.delete(`/games/${id}`)
		return response.data
	},
}
