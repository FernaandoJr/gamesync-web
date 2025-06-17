import { ButtonLink } from "../components/ui/button"

export default function Home() {
	return (
		<section className="bg-white">
			<div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 lg:py-16 lg:grid-cols-12">
				<div className="place-self-center mr-auto lg:col-span-7">
					<h1 className="mb-4 max-w-2xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
						Gerencie Sua Biblioteca de Jogos em Um Só Lugar
					</h1>
					<p className="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
						GameSync permite que você organize sua coleção de jogos
						em várias plataformas. Acompanhe seu progresso, gerencie
						seus favoritos e descubra novos jogos para jogar.
					</p>
					<ButtonLink href="/register" className="mr-3 text-gray-900">
						Começar
					</ButtonLink>
					<ButtonLink href="/games" variant="outline">
						Ver jogos
					</ButtonLink>
				</div>
				<div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
					<div className="relative h-64 w-full rounded-lg bg-gaming-100 flex items-center justify-center">
						<div className="text-gaming-700 text-3xl font-bold">
							GameSync
						</div>
						<div className="absolute -bottom-4 -right-4 h-24 w-24 bg-gaming-500 rounded-lg"></div>
						<div className="absolute -top-4 -left-4 h-16 w-16 bg-gaming-700 rounded-lg"></div>
					</div>
				</div>
			</div>

			<div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
				<div className="mb-8 max-w-screen-md lg:mb-16">
					<h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">
						Projetado para jogadores como você
					</h2>
					<p className="text-gray-500 sm:text-xl">
						GameSync ajuda você a gerenciar sua experiência de jogo
						com recursos poderosos.
					</p>
				</div>
				<div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
					<div>
						<div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-gaming-100 lg:h-12 lg:w-12">
							<svg
								className="w-5 h-5 text-gaming-600 lg:w-6 lg:h-6"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
									clipRule="evenodd"></path>
							</svg>
						</div>
						<h3 className="mb-2 text-xl font-bold">
							Gerenciamento de Biblioteca
						</h3>
						<p className="text-gray-500">
							Acompanhe todos os seus jogos em várias plataformas
							em uma biblioteca centralizada.
						</p>
					</div>
					<div>
						<div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-gaming-100 lg:h-12 lg:w-12">
							<svg
								className="w-5 h-5 text-gaming-600 lg:w-6 lg:h-6"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
							</svg>
						</div>
						<h3 className="mb-2 text-xl font-bold">
							Acompanhamento de Progresso
						</h3>
						<p className="text-gray-500">
							Acompanhe seu progresso nos jogos, horas jogadas e
							status de conclusão.
						</p>
					</div>
					<div>
						<div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-gaming-100 lg:h-12 lg:w-12">
							<svg
								className="w-5 h-5 text-gaming-600 lg:w-6 lg:h-6"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
									clipRule="evenodd"></path>
							</svg>
						</div>
						<h3 className="mb-2 text-xl font-bold">
							Categorias Personalizáveis
						</h3>
						<p className="text-gray-500">
							Organize seus jogos com tags personalizadas, gêneros
							e plataformas para um melhor gerenciamento.
						</p>
					</div>
				</div>
			</div>

			<div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
				<div className="mx-auto max-w-screen-sm text-center">
					<h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900">
						Comece a gerenciar seus jogos hoje
					</h2>
					<p className="mb-6 font-light text-gray-500 md:text-lg">
						Crie sua conta agora e comece a organizar sua biblioteca
						de jogos.
					</p>
					<ButtonLink
						href="/register"
						className="text-center text-black">
						Cadastre-se gratuitamente
					</ButtonLink>
				</div>
			</div>
		</section>
	)
}
