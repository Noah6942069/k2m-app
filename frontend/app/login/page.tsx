"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Sparkles, TrendingUp, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const { loginWithEmail, user } = useAuth()
    const router = useRouter()

    // Form State
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            router.push("/dashboard") // Redirect to /dashboard instead of /overview if that's the main route, checking next...
        }
    }, [user, router])

    const handleEmailLogin = async (e?: React.FormEvent) => {
        e?.preventDefault()

        if (!email || !password) {
            setError("Please enter both email and password")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await loginWithEmail(email, password)
            // Redirect handled by useEffect
        } catch (err: any) {
            console.error("Login Error:", err)

            // Professional Error Handling
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("Invalid email or password. Please try again.")
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many failed attempts. Please try again later.")
            } else {
                setError("An unexpected error occurred. Please contact support.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0b0d14] flex selection:bg-primary/30 selection:text-white">
            {/* Left Side - Visual Storytelling */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a0b10]">

                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-float" />

                <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/k2m-logo-new.png"
                            alt="K2M Analytics"
                            className="h-10 w-auto"
                        />
                    </div>

                    {/* Hero Content */}
                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-5xl font-display font-bold text-white leading-[1.1]">
                            Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Power</span> of Your Data
                        </h1>
                        <p className="text-lg text-zinc-400 leading-relaxed">
                            Experience the next generation of business intelligence.
                            AI-driven insights, real-time analytics, and beautiful data visualization.
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span className="text-sm text-zinc-300">AI-Powered</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-zinc-300">Real-time Stats</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Copyright */}
                    <div className="text-xs text-zinc-600 font-medium tracking-wide uppercase">
                        © 2026 K2M Analytics. All Rights Reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent opacity-50 pointer-events-none" />

                <div className="w-full max-w-[420px] space-y-8 relative z-10">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-zinc-500">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-200 hover:bg-white/[0.05]"
                                    placeholder="name@company.com"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-medium text-zinc-300">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => { }}
                                        className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-200 hover:bg-white/[0.05] pr-12"
                                        placeholder="••••••••"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm animate-scale-in">
                                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                                <p>{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium text-base shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <div className="pt-2 text-center">
                            <p className="text-zinc-500 text-sm">
                                Don't have an account?{" "}
                                <button type="button" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Contact Admin
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
