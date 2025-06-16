"use client"

import { useEffect } from "react"
import { GameStatus } from "../../../lib/game-service"

export function DebugGameStatus() {
	useEffect(() => {
		console.log("Available GameStatus values:", Object.values(GameStatus))
	}, [])

	return null
}

export default DebugGameStatus
