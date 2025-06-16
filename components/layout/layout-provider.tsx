"use client"

import { Toaster } from "../ui/toaster"
import React from "react"

interface LayoutProviderProps {
	children: React.ReactNode
}

export function LayoutProvider({ children }: Readonly<LayoutProviderProps>) {
	return (
		<>
			{children}
			<Toaster />
		</>
	)
}
