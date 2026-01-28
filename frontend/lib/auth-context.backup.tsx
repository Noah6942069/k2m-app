"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

export type UserRole = "admin" | "client"

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    companyId?: string
    companyName?: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    isAdmin: boolean
    isClient: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const DEMO_USERS: Record<string, { password: string; user: User }> = {
    "admin@k2m.com": {
        password: "admin123",
        user: {
            id: "1",
            email: "admin@k2m.com",
            name: "K2M Admin",
            role: "admin"
        }
    },
    "altech@client.com": {
        password: "client123",
        user: {
            id: "2",
            email: "altech@client.com",
            name: "Altech",
            role: "client",
            companyId: "1",
            companyName: "Altech"
        }
    },
    "techstart@client.com": {
        password: "client123",
        user: {
            id: "3",
            email: "techstart@client.com",
            name: "TechStart Inc",
            role: "client",
            companyId: "2",
            companyName: "TechStart Inc"
        }
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    // Only run on client side after mount
    useEffect(() => {
        setMounted(true)
        try {
            const storedUser = localStorage.getItem("k2m_session_v2")
            if (storedUser) {
                const parsed = JSON.parse(storedUser)
                setUser(parsed)
            }
        } catch {
            localStorage.removeItem("k2m_session_v2")
        }
        setLoading(false)
    }, [])

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const normalizedEmail = email.toLowerCase().trim()
        const demoUser = DEMO_USERS[normalizedEmail]

        if (!demoUser) {
            return { success: false, error: "User not found" }
        }

        if (demoUser.password !== password) {
            return { success: false, error: "Invalid password" }
        }

        setUser(demoUser.user)
        localStorage.setItem("k2m_session_v2", JSON.stringify(demoUser.user))

        return { success: true }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem("k2m_session_v2")
        // Navigation handled by the component calling logout
    }, [])

    // Prevent hydration mismatch
    if (!mounted) {
        return null
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAdmin: user?.role === "admin",
                isClient: user?.role === "client"
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
