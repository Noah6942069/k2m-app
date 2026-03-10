"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeSlash, WarningCircle, CircleNotch, Shield, ArrowLeft, ChartLineUp, Brain, ShieldCheck } from "@phosphor-icons/react"
import StarBorder from "@/components/ui/StarBorder"
import { isMultiFactorError, getResolverFromError, verifyTotpSignIn } from "@/lib/auth-2fa"
import { MultiFactorResolver } from "firebase/auth"
import { TwoFactorEnrollment } from "@/components/auth/TwoFactorEnrollment"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const { loginWithEmail, logout, user, refresh2FAStatus } = useAuth()
    const router = useRouter()

    // Form State
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 2FA State
    const [show2FA, setShow2FA] = useState(false)
    const [twoFactorCode, setTwoFactorCode] = useState("")
    const [resolver, setResolver] = useState<MultiFactorResolver | null>(null)

    // 2FA Enrollment State (for users who don't have 2FA yet)
    const [showEnrollment, setShowEnrollment] = useState(false)
    const hasLoggedOut = useRef(false)

    useEffect(() => {
        // Don't interfere if user is currently verifying their 2FA code
        if (show2FA) return

        if (user && user.has2FA) {
            // User is logged in AND has 2FA enrolled - allow access
            router.push("/dashboard")
        } else if (user && !user.has2FA && password) {
            // User just logged in (password is in state) but no 2FA - force enrollment
            setShowEnrollment(true)
        } else if (user && !user.has2FA && !password && !hasLoggedOut.current) {
            // User is logged in from a previous session (page refresh) but no 2FA
            // Log them out so they go through the normal login flow
            // This ensures we have their password for re-authentication
            hasLoggedOut.current = true
            logout()
        }
    }, [user, router, password, logout, show2FA])

    const handleEmailLogin = async (e?: React.FormEvent) => {
        e?.preventDefault()

        if (!email || !password) {
            setError("Zadejte email a heslo")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await loginWithEmail(email, password)
            // If login succeeds without MFA error, user doesn't have 2FA yet
            // The useEffect above will detect this and show enrollment
        } catch (err: any) {
            // Check if this is a multi-factor authentication error
            if (isMultiFactorError(err)) {
                // User has 2FA enabled, show verification code input
                setResolver(getResolverFromError(err))
                setShow2FA(true)
                setLoading(false)
                return
            }

            // Log the actual error for debugging
            console.error("Login error:", err.code, err.message, err)

            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError("Neplatný email nebo heslo.")
            } else if (err.code === 'auth/too-many-requests') {
                setError("Příliš mnoho pokusů. Zkuste to později.")
            } else if (err.code === 'auth/network-request-failed') {
                setError("Chyba sítě. Zkontrolujte připojení k internetu.")
            } else if (err.code === 'auth/user-disabled') {
                setError("Tento účet byl deaktivován.")
            } else {
                setError(`Nastala chyba: ${err.message || err.code || "Neznámá chyba"}`)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleVerify2FA = async (e?: React.FormEvent) => {
        e?.preventDefault()

        if (!resolver || !twoFactorCode || twoFactorCode.length !== 6) {
            setError("Zadejte 6místný kód")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await verifyTotpSignIn(resolver, twoFactorCode)
            // Immediately redirect - don't wait for useEffect (show2FA guard blocks it)
            router.push("/dashboard")
        } catch (err: any) {
            if (err.code === 'auth/invalid-verification-code') {
                setError("Neplatný kód. Zkuste nový kód z aplikace.")
            } else if (err.code === 'auth/quota-exceeded' || err.code === 'auth/too-many-requests') {
                setError("Příliš mnoho pokusů. Zkuste to později.")
            } else {
                setError("Ověření selhalo. Zkuste to znovu.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handle2FAEnrollmentSuccess = () => {
        refresh2FAStatus()
        setShowEnrollment(false)
        // useEffect will redirect to dashboard once has2FA updates
    }

    return (
        <div className="fixed inset-0 flex" style={{ background: '#04010e' }}>
            {/* Left Side - Visual Panel (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/login-visual.jpg"
                        alt="Data Visualization"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#04010e] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04010e]/80 via-transparent to-[#04010e]/40" />
                </div>

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
                    {/* Back to home */}
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Zpet na uvod</span>
                    </Link>

                    {/* Main content */}
                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-white">
                            Odhalte potencial vasich dat
                        </h1>
                        <p className="text-lg text-white/50 leading-relaxed">
                            K2M Analytics vam pomaha transformovat surova data na akcni obchodni rozhodnuti pomoci pokrocile umele inteligence.
                        </p>

                        {/* Feature highlights */}
                        <div className="space-y-4 pt-4">
                            {[
                                { icon: ChartLineUp, text: "Realtime analyzy a reporty" },
                                { icon: Brain, text: "AI-driven doporuceni" },
                                { icon: ShieldCheck, text: "Enterprise-grade zabezpeceni" },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-[#9F84FD]" weight="duotone" />
                                    </div>
                                    <span className="text-white/70">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-white/20">
                        © 2026 K2M Analytics
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center overflow-auto p-6 sm:p-8">
                {/* Ambient glow */}
                <div
                    className="absolute pointer-events-none lg:hidden"
                    style={{
                        top: '-20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '800px',
                        height: '600px',
                        background: 'radial-gradient(ellipse at center, rgba(45, 29, 146, 0.15) 0%, rgba(29, 17, 120, 0.08) 40%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />

                {/* Subtle dot grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(124, 92, 252, 0.8) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Content */}
                <div className="relative z-10 w-full max-w-[400px]">
                    {/* Mobile: Back link */}
                    <Link 
                        href="/"
                        className="lg:hidden inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Zpet</span>
                    </Link>

                    {/* Logo */}
                    <div className="flex flex-col items-center gap-3 mb-8">
                        <Image
                            src="/k2m-logo-new.png"
                            alt="K2M Analytics"
                            width={160}
                            height={40}
                            className="h-8 sm:h-10 w-auto"
                        />
                        <p className="text-[11px] tracking-[0.3em] uppercase font-medium text-white/20">
                            Business Intelligence Platform
                        </p>
                    </div>

                    {/* Card wrapper */}
                    <div className="relative w-full">
                        {/* Card ambient glow */}
                        <div
                            className="absolute -inset-6 rounded-3xl pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse at center, rgba(124, 92, 252, 0.08) 0%, transparent 70%)',
                                filter: 'blur(30px)',
                            }}
                        />

                        {/* Card */}
                        <div
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(180deg, rgba(13, 10, 26, 0.95) 0%, rgba(7, 3, 18, 0.98) 100%)',
                                border: '1px solid rgba(124, 92, 252, 0.08)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(124, 92, 252, 0.03)',
                            }}
                        >
                            {/* Top accent line */}
                            <div
                                className="h-px w-full"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 10%, rgba(124, 92, 252, 0.25) 40%, rgba(124, 92, 252, 0.4) 50%, rgba(124, 92, 252, 0.25) 60%, transparent 90%)',
                                }}
                            />

                        <div className="p-6 sm:p-8">
                            {/* Header */}
                            <div className="text-center mb-7">
                                {show2FA ? (
                                    <>
                                        <div className="flex items-center justify-center gap-2.5 mb-2">
                                            <Shield className="w-5 h-5 text-[#7C5CFC]" weight="duotone" />
                                            <h2 className="text-[22px] font-semibold text-white tracking-tight">
                                                Dvoufaktorové ověření
                                            </h2>
                                        </div>
                                        <p className="text-sm text-white/35">
                                            Zadejte 6místný kód z vaší aplikace
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-[22px] font-semibold text-white tracking-tight mb-1.5">
                                            Vítejte zpět
                                        </h2>
                                        <p className="text-sm text-white/35">
                                            Přihlaste se do svého účtu
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Form */}
                            <form onSubmit={show2FA ? handleVerify2FA : handleEmailLogin} className="space-y-5">
                                {show2FA ? (
                                    /* 2FA Verification Code Field */
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider block">
                                            Ověřovací kód
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={twoFactorCode}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "")
                                                setTwoFactorCode(value)
                                            }}
                                            className="w-full h-14 px-4 rounded-xl text-white text-center text-2xl font-mono tracking-[0.3em] placeholder-white/10 bg-white/[0.03] border border-white/[0.06] focus:outline-none focus:border-[#7C5CFC]/40 focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all duration-200 disabled:opacity-50"
                                            placeholder="000000"
                                            disabled={loading}
                                            autoFocus
                                        />
                                        <p className="text-xs text-white/25 text-center mt-2">
                                            Otevřete aplikaci Google Authenticator
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider block">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl text-white text-sm placeholder-white/15 bg-white/[0.03] border border-white/[0.06] focus:outline-none focus:border-[#7C5CFC]/40 focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all duration-200 disabled:opacity-50"
                                                placeholder="jmeno@firma.cz"
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
                                                    Heslo
                                                </label>
                                                <button
                                                    type="button"
                                                    className="text-[11px] text-white/25 hover:text-[#7C5CFC] transition-colors duration-200"
                                                >
                                                    Zapomenuté heslo?
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full h-12 px-4 pr-12 rounded-xl text-white text-sm placeholder-white/15 bg-white/[0.03] border border-white/[0.06] focus:outline-none focus:border-[#7C5CFC]/40 focus:ring-2 focus:ring-[#7C5CFC]/10 transition-all duration-200 disabled:opacity-50"
                                                    placeholder="••••••••"
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#7C5CFC] transition-colors duration-200"
                                                >
                                                    {showPassword ? <EyeSlash className="w-4 h-4" weight="duotone" /> : <Eye className="w-4 h-4" weight="duotone" />}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl text-red-300/90 text-sm bg-red-950/20 border border-red-500/15 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <WarningCircle className="w-4 h-4 shrink-0 text-red-400/80" weight="duotone" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-1">
                                    <StarBorder
                                        as="button"
                                        type="submit"
                                        disabled={loading}
                                        color="#4a2d8a"
                                        speed="4s"
                                    >
                                        {loading ? (
                                            <>
                                                <CircleNotch className="w-4 h-4 animate-spin" weight="duotone" />
                                                {show2FA ? "Ověřování..." : "Přihlašování..."}
                                            </>
                                        ) : (
                                            show2FA ? "Ověřit kód" : "Přihlásit se"
                                        )}
                                    </StarBorder>
                                </div>

                                {/* Back button for 2FA */}
                                {show2FA && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShow2FA(false)
                                            setTwoFactorCode("")
                                            setResolver(null)
                                            setError(null)
                                        }}
                                        className="w-full text-center text-sm text-white/30 hover:text-[#7C5CFC] transition-colors duration-200"
                                        disabled={loading}
                                    >
                                        ← Zpět na přihlášení
                                    </button>
                                )}
                            </form>

                            {/* Divider */}
                            <div className="my-6 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(124, 92, 252, 0.1), transparent)' }} />

                            {/* Footer */}
                            <p className="text-center text-white/20 text-sm">
                                Potřebujete přístup?{" "}
                                <button type="button" className="text-white/35 hover:text-[#7C5CFC] font-medium transition-colors duration-200">
                                    Kontaktujte administrátora
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Mobile Copyright */}
                    <p className="lg:hidden text-center text-xs text-white/10 mt-8">
                        © 2026 K2M Analytics
                    </p>
                </div>
            </div>

            {/* 2FA Enrollment Modal - forced after login if user has no 2FA */}
            <TwoFactorEnrollment
                open={showEnrollment}
                onClose={() => {}}
                onSuccess={handle2FAEnrollmentSuccess}
                userEmail={user?.email || email}
                userPassword={password}
                mandatory
            />
        </div>
    )
}
