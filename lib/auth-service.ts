import { apiClient } from "./api-client"

// Helper for base64 encoding that works on both client & server
const safeEncode = (str: string): string => {
	if (typeof window !== "undefined") {
		return btoa(str)
	} else {
		// Node.js environment
		return Buffer.from(str).toString("base64")
	}
}

export const authService = {
	// Login with username & password
	login: async (username: string, password: string) => {
		try {
			// Create base64 encoded credentials for Basic Auth
			const token = safeEncode(`${username}:${password}`)

			// Store token in localStorage (only in browser)
			if (typeof window !== "undefined") {
				localStorage.setItem("authToken", token)
			}

			// Test the token by getting the current user profile
			const response = await apiClient.get("/users/me")
			return { success: true, user: response.data }
		} catch (error) {
			// Clear token if login failed (only in browser)
			if (typeof window !== "undefined") {
				localStorage.removeItem("authToken")
			}
			throw error
		}
	},
	// Logout
	logout: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("authToken")
		}
		return { success: true }
	},
	// Check if user is authenticated
	isAuthenticated: () => {
		if (typeof window === "undefined") {
			return false
		}
		return !!localStorage.getItem("authToken")
	},
}
