import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Type definitions for API responses
export interface ApiResponse<T> {
	data: T
	success: boolean
	message?: string
}

export interface ApiError {
	message: string
	code?: string
	status?: number
	errors?: Record<string, string[]>
}

export const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	timeout: 10000, // 10 seconds timeout
})

// Interceptor to handle authentication
apiClient.interceptors.request.use(
	(config) => {
		// Only access localStorage in browser environment
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("authToken")
			if (token) {
				config.headers.Authorization = `Basic ${token}`
			}
		}
		return config
	},
	(error) => {
		// Request error handling
		return Promise.reject(error)
	}
)

// API response handling
apiClient.interceptors.response.use(
	(response) => {
		// You can add additional processing here if needed
		return response
	},
	(error) => {
		// Format error for better handling in components
		const formattedError: ApiError = {
			message: "An unexpected error occurred",
			status: error.response?.status,
		}

		// Handle specific error cases
		if (error.response) {
			// Server responded with error status			formattedError.message = error.response.data?.message ?? `Error: ${error.response.status}`;
			formattedError.code = error.response.data?.code
			formattedError.errors = error.response.data?.errors

			// Handle authentication errors
			if (
				error.response.status === 401 &&
				typeof window !== "undefined"
			) {
				// Unauthorized, clear token and redirect to login
				localStorage.removeItem("authToken")
				// Use a delay to allow the current code to complete
				setTimeout(() => {
					window.location.href = "/login"
				}, 100)
			}
		} else if (error.request) {
			// No response received
			formattedError.message =
				"No response from server. Please check your connection."
		}
		// Log error for debugging
		console.error("API Error:", formattedError)
		// Convert to Error object to satisfy ESLint
		const errorObject = new Error(formattedError.message)
		// Add API error details to the Error object
		Object.assign(errorObject, { apiError: formattedError })

		return Promise.reject(errorObject)
	}
)
