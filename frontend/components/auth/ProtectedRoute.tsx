"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Sparkle } from "@phosphor-icons/react"

interface ProtectedRouteProps {
    children: React.ReactNode
    adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth()
    const router = useRouter()
    const hasRedirected = useRef(false)
    const [timedOut, setTimedOut] = useState(false)

    // Timeout mechanism: if auth doesn't resolve in 5 seconds, redirect to login
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (loading) {
                console.warn("[ProtectedRoute] Auth loading timeout - redirecting to login")
                setTimedOut(true)
            }
        }, 5000)

        return () => clearTimeout(timeout)
    }, [loading])

    useEffect(() => {
        if (timedOut && !hasRedirected.current) {
            hasRedirected.current = true
            router.push("/login")
        }
    }, [timedOut, router])

    useEffect(() => {
        if (!loading && !hasRedirected.current) {
            if (!user) {
                hasRedirected.current = true
                router.push("/login")
            } else if (!user.has2FA) {
                // User logged in but hasn't enrolled 2FA - send back to login for enrollment
                hasRedirected.current = true
                router.push("/login")
            } else if (adminOnly && !isAdmin) {
                hasRedirected.current = true
                router.push("/dashboard")
            }
        }
    }, [user, loading, isAdmin, adminOnly]) // eslint-disable-line react-hooks/exhaustive-deps

    // Loading state
    if (loading && !timedOut) {
        return (
            <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#7c5cfc]/10 flex items-center justify-center animate-pulse">
                        <Sparkle className="w-6 h-6 text-[#7c5cfc]" weight="duotone" />
                    </div>
                    <p className="text-zinc-500 font-medium">Loading...</p>
                </div>
            </div>
        )
    }

    // Not authenticated, timed out, or no 2FA
    if (!user || timedOut || !user.has2FA) {
        return null
    }

    // Admin only check
    if (adminOnly && !isAdmin) {
        return null
    }

    return <>{children}</>
}
