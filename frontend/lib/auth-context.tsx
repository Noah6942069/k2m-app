"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react"
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from "firebase/auth"
import { auth } from "./firebase"
import { is2FAEnabled } from "./auth-2fa"

// In a real application, these roles would come from your database or custom claims.
export type UserRole = "admin" | "client"

// Configuration: Emails that have "Admin" access level.
// Regular users (Clients) can be added directly in the Firebase Console without changing this list.
const ADMIN_EMAILS = [
    "noahk2m@gmail.com",
    "noahkaya0024@gmail.com",
    "kusak@mkprod.cz"
]

// Inactivity timeout in milliseconds (5 minutes)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000

export interface AppUser {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    role: UserRole
    companyId?: string
    has2FA: boolean
}

interface AuthContextType {
    user: AppUser | null
    loading: boolean
    loginWithGoogle: () => Promise<void>
    loginWithEmail: (email: string, pass: string) => Promise<void>
    logout: () => Promise<void>
    isAdmin: boolean
    isClient: boolean
    refresh2FAStatus: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null)
    const [loading, setLoading] = useState(true)
    const inactivityTimer = useRef<NodeJS.Timeout | null>(null)

    const performLogout = useCallback(async () => {
        if (!auth) return
        try {
            await signOut(auth)
        } catch (error) {
            console.error("[Auth] Logout Failed", error)
        }
    }, [])

    // Inactivity auto-logout
    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current)
        }
        inactivityTimer.current = setTimeout(() => {
            if (user) {
                performLogout()
            }
        }, INACTIVITY_TIMEOUT)
    }, [user, performLogout])

    // Set up activity listeners when user is logged in
    useEffect(() => {
        if (!user) {
            if (inactivityTimer.current) {
                clearTimeout(inactivityTimer.current)
                inactivityTimer.current = null
            }
            return
        }

        const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"]

        const handleActivity = () => {
            resetInactivityTimer()
        }

        // Start the timer
        resetInactivityTimer()

        // Listen for user activity
        activityEvents.forEach((event) => {
            window.addEventListener(event, handleActivity, { passive: true })
        })

        return () => {
            activityEvents.forEach((event) => {
                window.removeEventListener(event, handleActivity)
            })
            if (inactivityTimer.current) {
                clearTimeout(inactivityTimer.current)
            }
        }
    }, [user, resetInactivityTimer])

    useEffect(() => {
        // Handle case where Firebase failed to initialize
        if (!auth) {
            console.warn("[Auth] Firebase auth not available - setting loading to false")
            setLoading(false)
            return
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const email = firebaseUser.email || ""

                // Read company_id and role from Firebase custom claims (set via /admin/assign-company)
                const idTokenResult = await firebaseUser.getIdTokenResult()
                const claimedCompanyId = idTokenResult.claims['company_id'] as string | undefined
                const claimedRole = idTokenResult.claims['role'] as string | undefined

                // K2M admin emails always get admin role regardless of claims
                const isAdmin = ADMIN_EMAILS.includes(email) || email.includes("admin") || email.endsWith("@k2m-analytics.com")
                const role: UserRole = isAdmin ? "admin" : (claimedRole === "admin" ? "admin" : "client")

                // Use real company_id from token claims; fall back to demo for dev/unassigned users
                const companyId = claimedCompanyId || "nexus-demo-001"

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role,
                    companyId,
                    has2FA: is2FAEnabled()
                })
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    // Allow components to refresh 2FA status (e.g., after enrollment)
    const refresh2FAStatus = useCallback(() => {
        if (user) {
            setUser(prev => prev ? { ...prev, has2FA: is2FAEnabled() } : null)
        }
    }, [user])

    const loginWithGoogle = async () => {
        if (!auth) {
            throw new Error("Firebase auth not initialized")
        }
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
        } catch (error) {
            console.error("[Auth] Google Login Failed", error)
            throw error
        }
    }

    const loginWithEmail = async (email: string, pass: string) => {
        if (!auth) {
            throw new Error("Firebase auth not initialized")
        }
        try {
            await signInWithEmailAndPassword(auth, email, pass)
        } catch (error) {
            // Error is handled in the UI component
            throw error
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginWithGoogle,
                loginWithEmail,
                logout: performLogout,
                isAdmin: user?.role === "admin",
                isClient: user?.role === "client",
                refresh2FAStatus
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
