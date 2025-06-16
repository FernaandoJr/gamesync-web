import * as React from "react"
import { useToast } from "./use-toast"

import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	type ToastProps,
} from "./toast"

type ToasterToastProps = ToastProps & {
	id: string
	title?: React.ReactNode
	description?: React.ReactNode
	action?: React.ReactNode
}

const Toaster = () => {
	const { toasts } = useToast()

	return (
		<ToastProvider>
			{toasts.map(function ({
				id,
				title,
				description,
				action,
				...props
			}: ToasterToastProps) {
				return (
					<Toast key={id} {...props}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>
									{description}
								</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				)
			})}
			<ToastViewport />
		</ToastProvider>
	)
}

export { Toaster }
