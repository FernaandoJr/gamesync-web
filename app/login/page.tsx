"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
	CardDescription,
} from "../../components/ui/card"
import { useToast } from "../../components/ui/use-toast"
import { authService } from "../../lib/auth-service"

export default function Login() {
	const router = useRouter()
	const { toast } = useToast()
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	})
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			await authService.login(formData.username, formData.password)
			router.push("/dashboard")
		} catch (err: unknown) {
			let errorMessage: string

			if (err instanceof Error) {
				errorMessage = err.message
			} else if (err && typeof err === "object" && "response" in err) {
				const axiosError = err as {
					response?: { data?: { message?: string } }
				}
				
				errorMessage =
					axiosError.response?.data?.message ??
					"Credenciais inválidas. Por favor, tente novamente."			} else {
				errorMessage = "Credenciais inválidas. Por favor, tente novamente."
			}
			
			toast({
				title: "Erro de Autenticação",
				description: errorMessage,
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="mx-auto max-w-md p-6">
			<Card>
				{" "}
				<CardHeader className="space-y-1 bg-gradient-to-r from-gaming-700 to-gaming-900  rounded-t-lg">					<CardTitle className="text-2xl text-center">
						Entrar no GameSync
					</CardTitle>
					<CardDescription className="text-center">
						Insira suas credenciais para acessar sua conta
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">							<Label htmlFor="username">Nome de usuário</Label>
							<Input
								id="username"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Digite seu nome de usuário"
								required
							/>
						</div>
						<div className="space-y-2">							<Label htmlFor="password">Senha</Label>
							<Input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Digite sua senha"
								required
							/>
						</div>{" "}
						<Button
							type="submit"
							className="w-full"
							variant="secondary"
							disabled={isLoading}>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col space-y-2 border-t pt-6">					<div className="text-sm text-center text-muted-foreground">
						Não tem uma conta?{" "}
						<Link
							href="/register"
							className="underline hover:text-primary/80 !text-black">
							Cadastre-se
						</Link>
					</div>
				</CardFooter>{" "}
			</Card>
		</div>
	)
}
