"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../components/ui/use-toast"
import { userService, User, UserUpdateDTO } from "../../lib/user-service"
import { authService } from "../../lib/auth-service"
// Import formatDate when needed for displaying dates
// import { formatDate } from "../../lib/utils"

export default function Profile() {
	const router = useRouter()
	const { toast } = useToast()

	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	// Form state
	const [formData, setFormData] = useState<UserUpdateDTO>({
		username: "",
		email: "",
		newPassword: "",
	})

	// Form validation errors
	const [formErrors, setFormErrors] = useState<Record<string, string>>({})
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

	// Data fetching
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				// Skip request if we're not authenticated
				if (
					typeof window !== "undefined" &&
					!localStorage.getItem("authToken")
				) {
					return
				}

				const userData = await userService.getCurrentUser()
				setUser(userData)

				// Initialize form data
				setFormData({
					username: userData.username,
					email: userData.email,
					newPassword: "",
				})
			} catch (err) {
				console.error("Error fetching user profile:", err)
				toast({
					title: "Error",
					description:
						"Failed to load user profile. Please try again later.",
					variant: "destructive",
				})
			} finally {
				setLoading(false)
			}
		}

		fetchUserProfile()
	}, [router, toast])

	// Handle form input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))

		// Clear error when field is edited
		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: "" }))
		}
	}
	// Form validation
	const validateForm = () => {
		const errors: Record<string, string> = {}

		if (!formData.username?.trim()) {
			errors.username = "Username is required"
		}

		if (!formData.email?.trim()) {
			errors.email = "Email is required"
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = "Email is invalid"
		}

		if (formData.newPassword && formData.newPassword.length < 6) {
			errors.newPassword = "Password must be at least 6 characters long"
		}

		setFormErrors(errors)
		return Object.keys(errors).length === 0
	}
	// Handle update user
	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm() || !user) {
			return
		}

		setIsSaving(true)

		try {
			const updatedUser = await userService.updateUser(user.id, formData)
			setUser(updatedUser)
			setIsEditing(false)
			toast({
				title: "Success",
				description: "Profile updated successfully!",
				variant: "default",
			})
		} catch (err) {
			console.error("Error updating user profile:", err)
			toast({
				title: "Error",
				description: "Failed to update profile. Please try again.",
				variant: "destructive",
			})
		} finally {
			setIsSaving(false)
		}
	}
	// Handle delete account
	const handleDeleteAccount = async () => {
		if (!user) return

		const confirmation = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone and all your games data will be lost."
		)

		if (confirmation) {
			try {
				await userService.deleteUser(user.id)
				authService.logout()
				toast({
					title: "Account Deleted",
					description: "Your account has been successfully deleted.",
					variant: "default",
				})
				router.push("/")
			} catch (err) {
				console.error("Error deleting account:", err)
				toast({
					title: "Error",
					description: "Failed to delete account. Please try again.",
					variant: "destructive",
				})
			}
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gaming-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">
						Loading your profile...
					</p>
				</div>
			</div>
		)
	}
	if (!user) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
					<p>User not found</p>
				</div>
				<Button onClick={() => router.push("/")}>Return to Home</Button>
			</div>
		)
	}

	return (
		<div className="max-w-3xl mx-auto my-8 px-4">
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Header */}
				<div className="p-6 bg-gaming-900 text-white">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold">Your Profile</h1>
						{!isEditing && (
							<Button
								onClick={() => setIsEditing(true)}
								variant="outline"
								className="border-white text-white hover:bg-white hover:text-gaming-900">
								Edit Profile
							</Button>
						)}{" "}
					</div>
				</div>

				{/* Profile Information */}
				<div className="p-6">
					{isEditing ? (
						<form onSubmit={handleUpdateUser} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									type="text"
									id="username"
									name="username"
									value={formData.username}
									onChange={handleChange}
									className={
										formErrors.username
											? "border-red-500"
											: ""
									}
								/>
								{formErrors.username && (
									<p className="text-sm text-red-500">
										{formErrors.username}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className={
										formErrors.email ? "border-red-500" : ""
									}
								/>
								{formErrors.email && (
									<p className="text-sm text-red-500">
										{formErrors.email}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="newPassword">
									New Password
								</Label>
								<Input
									type="password"
									id="newPassword"
									name="newPassword"
									value={formData.newPassword}
									onChange={handleChange}
									placeholder="Leave blank to keep current password"
									className={
										formErrors.newPassword
											? "border-red-500"
											: ""
									}
								/>
								{formErrors.newPassword && (
									<p className="text-sm text-red-500">
										{formErrors.newPassword}
									</p>
								)}
							</div>

							<div className="flex space-x-4 pt-4">
								<Button type="submit" disabled={isSaving}>
									{isSaving ? "Saving..." : "Save Changes"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsEditing(false)}>
									Cancel
								</Button>
							</div>
						</form>
					) : (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Username
									</h3>
									<p className="mt-1 text-lg text-gray-900">
										{user.username}
									</p>
								</div>

								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Email
									</h3>
									<p className="mt-1 text-lg text-gray-900">
										{user.email}
									</p>
								</div>

								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Roles
									</h3>
									<div className="mt-1 flex flex-wrap gap-2">
										{user.roles.map((role) => (
											<span
												key={role}
												className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">
												{role}
											</span>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Danger Zone */}
				{!isEditing && (
					<div className="p-6 bg-gray-50 border-t border-gray-200">
						<h2 className="text-lg font-semibold text-red-600 mb-4">
							Danger Zone
						</h2>
						<Button
							onClick={handleDeleteAccount}
							variant="destructive">
							Delete Account
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
