import { apiClient } from "./api-client"

export interface User {
	id: string
	username: string
	email: string
	roles: string[]
}

export interface UserRegistrationDTO {
	username: string
	email: string
	password: string
}

export interface UserUpdateDTO {
	username?: string
	email?: string
	newPassword?: string
}

export const userService = {
	// Register a new user
	register: async (userData: UserRegistrationDTO) => {
		const response = await apiClient.post<User>("/users/register", userData)
		return response.data
	},

	// Get authenticated user profile
	getCurrentUser: async () => {
		const response = await apiClient.get<User>("/users/me")
		return response.data
	},

	// Get user by ID (only accessible by the user themselves or admin)
	getUserById: async (id: string) => {
		const response = await apiClient.get<User>(`/users/${id}`)
		return response.data
	},

	// Update user data
	updateUser: async (id: string, userData: UserUpdateDTO) => {
		const response = await apiClient.put<User>(`/users/${id}`, userData)
		return response.data
	},

	// Delete a user
	deleteUser: async (id: string) => {
		const response = await apiClient.delete(`/users/${id}`)
		return response.data
	},
}
