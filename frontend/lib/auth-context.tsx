"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from "firebase/auth"
import { auth } from "./firebase"

// In a real application, these roles would come from your database or custom claims.
export type UserRole = "admin" | "client"

// Configuration: Emails that have "Admin" access level.
// Regular users (Clients) can be added directly in the Firebase Console without changing this list.
const ADMIN_EMAILS = [
    "noahk2m@gmail.com",
    "noahkaya0024@gmail.com",
    "kusak@mkprod.cz"
]

export interface AppUser {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    role: UserRole
    companyId?: string
}

interface AuthContextType {
    user: AppUser | null
    loading: boolean
    loginWithGoogle: () => Promise<void>
    loginWithEmail: (email: string, pass: string) => Promise<void>
    logout: () => Promise<void>
    isAdmin: boolean
    isClient: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null)
    const [loading, setLoading] = useState(true)

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

                // By default, anyone you add in the Firebase Console is allowed to log in.
                // We determine if they are an Admin or a Client based on the ADMIN_EMAILS list.
                const isAdmin = ADMIN_EMAILS.includes(email) || email.includes("admin") || email.endsWith("@k2m-analytics.com")

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: isAdmin ? "admin" : "client",
                    companyId: "demo-company-id"
                })
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

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

    const logout = async () => {
        if (!auth) return
        try {
            await signOut(auth)
        } catch (error) {
            console.error("[Auth] Logout Failed", error)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginWithGoogle,
                loginWithEmail,
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
