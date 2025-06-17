"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
	Game,
	GameCreateDTO,
	GameUpdateDTO,
	GameStatus,
	GameSource,
} from "../../lib/game-service"
import { Button } from "../ui/button"

interface GameFormProps {
	game?: Game
	onSubmit: (data: GameCreateDTO | GameUpdateDTO) => Promise<void>
	isLoading: boolean
	isEditing?: boolean
}

export default function GameForm({
	game,
	onSubmit,
	isLoading,
	isEditing = false,
}: GameFormProps) {
	const router = useRouter()
	// Form state
	const [formData, setFormData] = useState<GameCreateDTO | GameUpdateDTO>({
		name: "",
		description: "",
		developer: "",
		imageUrl: "",
		hoursPlayed: 0,
		favorite: false,
		genres: [],
		tags: [],
		platforms: [],
		status: GameStatus.WISHLIST,
		source: GameSource.MANUAL,
	})

	// Error handling
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [tagInput, setTagInput] = useState("")
	const [genreInput, setGenreInput] = useState("")
	const [platformInput, setPlatformInput] = useState("")

	// Populate form with game data if editing
	useEffect(() => {
		if (game) {
			setFormData({
				name: game.name,
				description: game.description || "",
				developer: game.developer || "",
				imageUrl: game.imageUrl || "",
				hoursPlayed: game.hoursPlayed || 0,
				favorite: game.favorite,
				genres: game.genres || [],
				tags: game.tags || [],
				platforms: game.platforms || [],
				status: game.status,
				source: game.source,
			})
		}
	}, [game])

	// Handle form input changes
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target

		if (type === "checkbox") {
			const checked = (e.target as HTMLInputElement).checked
			setFormData((prev) => ({
				...prev,
				[name]: checked,
			}))
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}))
		}

		// Clear error when field is edited
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }))
		}
	}

	// Handle numeric input changes
	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		const numValue = value === "" ? 0 : parseFloat(value)

		setFormData((prev) => ({
			...prev,
			[name]: numValue,
		}))

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }))
		}
	}

	// Handle adding tags, genres, platforms
	const handleAddItem = (
		type: "tags" | "genres" | "platforms",
		value: string
	) => {
		if (!value.trim()) return

		// Don't add duplicates
		if (formData[type]?.includes(value.trim())) return

		setFormData((prev) => ({
			...prev,
			[type]: [...(prev[type] || []), value.trim()],
		}))

		// Reset input field
		if (type === "tags") setTagInput("")
		if (type === "genres") setGenreInput("")
		if (type === "platforms") setPlatformInput("")
	}

	// Handle removing tags, genres, platforms
	const handleRemoveItem = (
		type: "tags" | "genres" | "platforms",
		index: number
	) => {
		setFormData((prev) => ({
			...prev,
			[type]: (prev[type] || []).filter((_, i) => i !== index),
		}))
	}
	// Form validation
	const validateForm = () => {
		const newErrors: Record<string, string> = {}
		if (!formData.name || !formData.name.trim()) {
			newErrors.name = "Nome é obrigatório"
		}

		if (formData.hoursPlayed && formData.hoursPlayed < 0) {
			newErrors.hoursPlayed = "Horas jogadas deve ser um número positivo"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}
	// Form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		await onSubmit(formData)
	}
	// Helper function for button text
	const getButtonText = () => {
		if (isLoading) {
			return "Salvando..."
		}
		return isEditing ? "Atualizar Jogo" : "Adicionar Jogo"
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Basic Information */}
			<div className="bg-white p-6 rounded-lg shadow-md">				<h2 className="text-xl font-semibold mb-4 pb-2 border-b">
					Informações do Jogo
				</h2>

				<div className="space-y-4">
					<div>						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-1">
							Nome do Jogo <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className={`w-full p-2 border rounded-md ${
								errors.name
									? "border-red-500"
									: "border-gray-300"
							}`}
							placeholder="Entre com o nome do jogo"
						/>
						{errors.name && (
							<p className="mt-1 text-sm text-red-500">
								{errors.name}
							</p>
						)}
					</div>					<div>
						<label
							htmlFor="developer"
							className="block text-sm font-medium text-gray-700 mb-1">
							Developer
						</label>
						<input
							type="text"
							id="developer"
							name="developer"
							value={formData.developer}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-md"
							placeholder="Entre com o nome do desenvolvedor"
						/>
					</div>

					<div>
						<label
							htmlFor="imageUrl"
							className="block text-sm font-medium text-gray-700 mb-1">
							URL da Imagem
						</label>
						<input
							type="text"
							id="imageUrl"
							name="imageUrl"
							value={formData.imageUrl}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-md"
							placeholder="https://exemplo.com/imagem-do-jogo.jpg"
						/>
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows={4}
							className="w-full p-2 border border-gray-300 rounded-md"
							placeholder="Entre com a descrição do jogo"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>							<label
								htmlFor="status"
								className="block text-sm font-medium text-gray-700 mb-1">
								Status do Jogo
							</label>{" "}
							<select
								id="status"
								name="status"
								value={formData.status}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-md bg-white">								<option
									value={GameStatus.WISHLIST}
									className="bg-purple-500 text-white">
									Lista de Desejos
								</option>
								<option
									value={GameStatus.PLAYING}
									className="bg-blue-500 text-white">
									Jogando
								</option>
								<option
									value={GameStatus.COMPLETED}
									className="bg-green-500 text-white">
									Concluído
								</option>								<option
									value={GameStatus.DROPPED}
									className="bg-red-500 text-white">
									Abandonado
								</option>
								<option
									value={GameStatus.NOT_STARTED}
									className="bg-gray-500 text-white">
									Não Iniciado
								</option>
							</select>
						</div>

						<div>							<label
								htmlFor="hoursPlayed"
								className="block text-sm font-medium text-gray-700 mb-1">
								Horas Jogadas
							</label>
							<input
								type="number"
								id="hoursPlayed"
								name="hoursPlayed"
								min="0"
								step="0.1"
								value={formData.hoursPlayed || 0}
								onChange={handleNumberChange}
								className={`w-full p-2 border rounded-md ${
									errors.hoursPlayed
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
							{errors.hoursPlayed && (
								<p className="mt-1 text-sm text-red-500">
									{errors.hoursPlayed}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center">
						<input
							type="checkbox"
							id="favorite"
							name="favorite"
							checked={formData.favorite}
							onChange={handleChange}
							className="h-4 w-4 text-gaming-600 focus:ring-gaming-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="favorite"
							className="ml-2 block text-sm text-gray-700">
							Mark as favorite
						</label>
					</div>
				</div>
			</div>
			{/* Tags and Categories */}
			<div className="bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-xl font-semibold mb-4 pb-2 border-b">
					Tags & Categories
				</h2>

				<div className="space-y-6">
					{/* Genres */}
					<div>
						<label
							htmlFor="genreInput"
							className="block text-sm font-medium text-gray-700 mb-1">
							Genres
						</label>
						<div className="flex">
							<input
								type="text"
								id="genreInput"
								value={genreInput}
								onChange={(e) => setGenreInput(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded-l-md"
								placeholder="Add a genre (e.g., RPG, Action)"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault()
										handleAddItem("genres", genreInput)
									}
								}}
							/>
							<button
								type="button"
								onClick={() =>
									handleAddItem("genres", genreInput)
								}
								className="px-3 py-2 bg-gaming-600 text-white rounded-r-md hover:bg-gaming-700">
								Add
							</button>
						</div>
						<div className="flex flex-wrap gap-2 mt-2">
							{formData.genres?.map((genre, index) => (
								<span
									key={`genre-${genre}-${index}`}
									className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
									{genre}
									<button
										type="button"
										onClick={() =>
											handleRemoveItem("genres", index)
										}
										className="ml-1 text-gray-600 hover:text-gray-900">
										×
									</button>
								</span>
							))}
						</div>
					</div>

					{/* Tags */}
					<div>
						<label
							htmlFor="tagInput"
							className="block text-sm font-medium text-gray-700 mb-1">
							Tags
						</label>
						<div className="flex">
							<input
								type="text"
								id="tagInput"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded-l-md"
								placeholder="Add a tag (e.g., Sci-Fi, Open World)"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault()
										handleAddItem("tags", tagInput)
									}
								}}
							/>
							<button
								type="button"
								onClick={() => handleAddItem("tags", tagInput)}
								className="px-3 py-2 bg-gaming-600 text-white rounded-r-md hover:bg-gaming-700">
								Add
							</button>
						</div>{" "}
						<div className="flex flex-wrap gap-2 mt-2">
							{formData.tags?.map((tag, index) => (
								<span
									key={`tag-${tag}-${index}`}
									className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center shadow-sm">
									{tag}
									<button
										type="button"
										onClick={() =>
											handleRemoveItem("tags", index)
										}
										className="ml-1 text-white hover:text-blue-100">
										×
									</button>
								</span>
							))}
						</div>
					</div>

					{/* Platforms */}
					<div>
						<label
							htmlFor="platformInput"
							className="block text-sm font-medium text-gray-700 mb-1">
							Platforms
						</label>
						<div className="flex">
							<input
								type="text"
								id="platformInput"
								value={platformInput}
								onChange={(e) =>
									setPlatformInput(e.target.value)
								}
								className="w-full p-2 border border-gray-300 rounded-l-md"
								placeholder="Add a platform (e.g., PC, PlayStation 5)"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault()
										handleAddItem(
											"platforms",
											platformInput
										)
									}
								}}
							/>
							<button
								type="button"
								onClick={() =>
									handleAddItem("platforms", platformInput)
								}
								className="px-3 py-2 bg-gaming-600 text-white rounded-r-md hover:bg-gaming-700">
								Add
							</button>
						</div>{" "}
						<div className="flex flex-wrap gap-2 mt-2">
							{formData.platforms?.map((platform, index) => (
								<span
									key={`platform-${platform}-${index}`}
									className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center shadow-sm">
									{platform}
									<button
										type="button"
										onClick={() =>
											handleRemoveItem("platforms", index)
										}
										className="ml-1 text-white hover:text-purple-100">
										×
									</button>
								</span>
							))}
						</div>
					</div>
				</div>
			</div>{" "}
			{/* Form Actions */}
			<div className="flex gap-3 mt-6">
				<Button
					type="submit"
					className="px-8"
					disabled={isLoading}
					variant={isEditing ? "secondary" : "success"}>
					{getButtonText()}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}>
					Cancel
				</Button>
			</div>
		</form>
	)
}
