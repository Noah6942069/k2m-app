"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { X, CheckCircle, WarningCircle, Info, Sparkle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

// Toast Types
export type ToastType = "success" | "error" | "info" | "insight"

export interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
}

// Toast Context
interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, "id">) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { ...toast, id }

        setToasts(prev => [...prev, newToast])

        // Auto-remove after duration
        const duration = toast.duration ?? 5000
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, duration)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    )
}

// Toast Container (renders at bottom-right)
function ToastContainer({
    toasts,
    onRemove
}: {
    toasts: Toast[]
    onRemove: (id: string) => void
}) {
    if (toasts.length === 0) return null

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    )
}

// Individual Toast
const toastConfig = {
    success: {
        icon: CheckCircle,
        bgColor: "bg-emerald-500/10 border-emerald-500/30",
        iconColor: "text-emerald-400",
        progressColor: "bg-emerald-500"
    },
    error: {
        icon: WarningCircle,
        bgColor: "bg-red-500/10 border-red-500/30",
        iconColor: "text-red-400",
        progressColor: "bg-red-500"
    },
    info: {
        icon: Info,
        bgColor: "bg-primary/10 border-primary/30",
        iconColor: "text-primary",
        progressColor: "bg-primary"
    },
    insight: {
        icon: Sparkle,
        bgColor: "bg-primary/10 border-primary/30",
        iconColor: "text-primary",
        progressColor: "bg-primary"
    }
}

function ToastItem({
    toast,
    onRemove
}: {
    toast: Toast
    onRemove: (id: string) => void
}) {
    const config = toastConfig[toast.type]
    const Icon = config.icon
    const duration = toast.duration ?? 5000

    return (
        <div
            className={cn(
                "relative flex items-start gap-3 p-4 pr-10 rounded-xl border backdrop-blur-md shadow-lg animate-enter overflow-hidden",
                "bg-card/95",
                config.bgColor
            )}
            role="alert"
        >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
                <Icon className={cn("w-5 h-5", config.iconColor)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                    {toast.title}
                </p>
                {toast.message && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {toast.message}
                    </p>
                )}
            </div>

            {/* Close button */}
            <button
                onClick={() => onRemove(toast.id)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30 overflow-hidden">
                <div
                    className={cn("h-full", config.progressColor)}
                    style={{
                        animation: `toast-progress ${duration}ms linear forwards`
                    }}
                />
            </div>

            <style jsx>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </div>
    )
}

// Convenience functions (can be used without context if needed)
export function toast(options: Omit<Toast, "id">) {
    // This is a placeholder - in real app, you'd use the context
    console.log("Toast:", options)
}

toast.success = (title: string, message?: string) =>
    toast({ type: "success", title, message })

toast.error = (title: string, message?: string) =>
    toast({ type: "error", title, message })

toast.info = (title: string, message?: string) =>
    toast({ type: "info", title, message })

toast.insight = (title: string, message?: string) =>
    toast({ type: "insight", title, message })
