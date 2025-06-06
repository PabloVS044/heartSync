import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const ToastProvider = React.forwardRef(function ToastProvider(props, ref) {
  const { className, ...otherProps } = props
  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
      {...otherProps}
    />
  )
})
ToastProvider.displayName = "ToastProvider"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-800 bg-green-950 text-green-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Toast = React.forwardRef(function Toast(props, ref) {
  const { className, variant, ...otherProps } = props
  return <div ref={ref} className={cn(toastVariants({ variant }), className)} {...otherProps} />
})
Toast.displayName = "Toast"

const ToastClose = React.forwardRef(function ToastClose(props, ref) {
  const { className, ...otherProps } = props
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
        className,
      )}
      toast-close=""
      {...otherProps}
    >
      <X className="h-4 w-4" />
    </button>
  )
})
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef(function ToastTitle(props, ref) {
  const { className, ...otherProps } = props
  return <div ref={ref} className={cn("text-sm font-semibold", className)} {...otherProps} />
})
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef(function ToastDescription(props, ref) {
  const { className, ...otherProps } = props
  return <div ref={ref} className={cn("text-sm opacity-90", className)} {...otherProps} />
})
ToastDescription.displayName = "ToastDescription"

export { ToastProvider, Toast, ToastClose, ToastTitle, ToastDescription }
