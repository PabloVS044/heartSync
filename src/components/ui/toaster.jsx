"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map((toast) => {
        const { id, title, description, action, variant } = toast
        return (
          <Toast key={id} variant={variant}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
    </ToastProvider>
  )
}
