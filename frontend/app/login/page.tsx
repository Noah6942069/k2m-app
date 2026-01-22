"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, ArrowRight, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
    console.log("Rendering LoginPage")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        const result = await login(email, password)

        if (result.success) {
            router.push("/dashboard")
        } else {
            setError(result.error || "Login failed")
        }

        setLoading(false)
    }

    const fillDemoCredentials = (role: "admin" | "client") => {
        if (role === "admin") {
            setEmail("admin@k2m.com")
            setPassword("admin123")
        } else {
            setEmail("acme@client.com")
            setPassword("client123")
        }
    }

    return (
        <div className="min-h-screen bg-[#0d0d12] flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#7c5cfc]/10 to-[#5b8def]/10 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-[#7c5cfc]/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#5b8def]/20 rounded-full blur-3xl" />
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Image
                        src="/k2m-logo-new.png"
                        alt="K2M Analytics"
                        width={140}
                        height={48}
                        className="object-contain"
                    />
                </div>

                {/* Hero Text */}
                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl font-bold text-white leading-tight">
                        Smart Data,<br />
                        Smarter Decisions
                    </h1>
                    <p className="text-zinc-400 max-w-md">
                        Transform your business data into actionable insights with AI-powered analytics and interactive dashboards.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Sparkles className="w-4 h-4 text-[#7c5cfc]" />
                            <span>AI-Powered Insights</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span>Real-time Analytics</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="relative z-10 text-sm text-zinc-600">
                    © 2024 K2M Analytics. All rights reserved.
                </p>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <Image
                            src="/k2m-logo-new.png"
                            alt="K2M"
                            width={120}
                            height={40}
                            className="object-contain"
                        />
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                        <p className="text-zinc-500 mt-2">Sign in to your account</p>
                    </div>

                    {/* Demo Quick Login */}
                    <div className="p-4 rounded-xl bg-[#7c5cfc]/5 border border-[#7c5cfc]/20">
                        <p className="text-sm text-zinc-400 mb-3">Quick demo login:</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fillDemoCredentials("admin")}
                                className="flex-1 px-3 py-2 text-xs rounded-lg bg-[#7c5cfc]/10 text-[#7c5cfc] hover:bg-[#7c5cfc]/20 transition-colors"
                            >
                                Admin Login
                            </button>
                            <button
                                onClick={() => fillDemoCredentials("client")}
                                className="flex-1 px-3 py-2 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            >
                                Client Login
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-zinc-600 focus:border-[#7c5cfc]/50 focus:ring-0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-zinc-600 focus:border-[#7c5cfc]/50 focus:ring-0 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#7c5cfc] hover:bg-[#6b4ce0] text-white font-medium"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-zinc-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-[#7c5cfc] hover:underline">
                            Contact K2M
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
