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
import { userService } from "../../lib/user-service"

export default function Register() {
	const router = useRouter()
	const { toast } = useToast()
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	})
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		// Validar formulário
		if (formData.password !== formData.confirmPassword) {
			toast({
				title: "Erro de Senha",
				description: "As senhas não coincidem",
				variant: "destructive",
			})
			return
		}

		setIsLoading(true)

		try {
			// Register the user
			const { username, email, password } = formData
			await userService.register({
				username,
				email,
				password,
			})
			
			toast({
				title: "Sucesso",
				description:
					"Conta criada com sucesso! Agora você pode fazer login.",
				variant: "default",
			})

			// Redirect to login
			router.push("/login")
		} catch (error: unknown) {
			let errorMessage: string

			if (error instanceof Error) {
				errorMessage = error.message
			} else if (
				typeof error === "object" &&
				error !== null &&
				"response" in error
			) {
				// Axios error
				const axiosError = error as {
					response?: { data?: { message?: string } }
				}
				
				errorMessage =
					axiosError.response?.data?.message ??
					"Falha ao registrar. Por favor, tente novamente."			} else {
				errorMessage = "Ocorreu um erro inesperado"
			}
			
			toast({
				title: "Erro de Cadastro",
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
				<CardHeader className="space-y-1">					<CardTitle className="text-2xl text-center">
						Criar uma Conta GameSync
					</CardTitle>
					<CardDescription className="text-center">
						Insira seus detalhes para registrar uma conta
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">							<Label htmlFor="username">Nome de usuário</Label>
							<Input
								id="username"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Escolha um nome de usuário"
								required
							/>
						</div>
						<div className="space-y-2">							<Label htmlFor="email">Email</Label>
							<Input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Digite seu email"
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
								placeholder="Crie uma senha"
								required
							/>
						</div>
						<div className="space-y-2">							<Label htmlFor="confirmPassword">
								Confirmar Senha
							</Label>
							<Input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Confirme sua senha"
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}>							<p className="text-sm text-black">
								{isLoading ? "Criando conta..." : "Cadastrar"}
							</p>
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col space-y-2 border-t pt-6">					<div className="text-sm text-center text-muted-foreground">
						Já tem uma conta?{" "}
						<Link
							href="/login"
							className="underline !text-black hover:text-primary/80">
							Entrar
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
