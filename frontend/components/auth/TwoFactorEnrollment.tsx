"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { WarningCircle, CircleNotch, CheckCircle, Shield, DeviceMobile, Envelope } from "@phosphor-icons/react"
import { generateTotpSecret, enrollTotp, isEmailVerified, sendVerificationEmail, reloadUser } from "@/lib/auth-2fa"
import { TotpSecret } from "firebase/auth"

interface TwoFactorEnrollmentProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    userEmail: string
    mandatory?: boolean
    userPassword?: string
}

export function TwoFactorEnrollment({ open, onClose, onSuccess, userEmail, mandatory = false, userPassword }: TwoFactorEnrollmentProps) {
    const [step, setStep] = useState<"email-verify" | "qr" | "verify" | "success">("qr")
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
    const [secret, setSecret] = useState<TotpSecret | null>(null)
    const [verificationCode, setVerificationCode] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [checkingEmail, setCheckingEmail] = useState(false)

    const handleSendVerificationEmail = async () => {
        setLoading(true)
        setError(null)
        try {
            await sendVerificationEmail()
            setEmailSent(true)
        } catch (err: any) {
            console.error("Email verification error:", err.code, err.message)
            if (err.code === "auth/too-many-requests") {
                setError("Too many requests. Please wait a moment and try again.")
            } else {
                setError(err.message || "Failed to send verification email")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCheckEmailVerified = async () => {
        setCheckingEmail(true)
        setError(null)
        try {
            const verified = await reloadUser()
            if (verified) {
                // Email is verified, proceed to QR code generation
                handleGenerateQR()
            } else {
                setError("Email not verified yet. Please check your inbox and click the verification link.")
            }
        } catch (err: any) {
            setError(err.message || "Failed to check verification status")
        } finally {
            setCheckingEmail(false)
        }
    }

    const handleGenerateQR = async () => {
        setLoading(true)
        setError(null)
        try {
            const { secret: totpSecret, qrCodeUrl: qrUrl } = await generateTotpSecret(userEmail, userPassword)
            setSecret(totpSecret)
            setQrCodeUrl(qrUrl)
            setStep("qr")
        } catch (err: any) {
            console.error("2FA QR generation error:", err.code, err.message, err)
            if (err.code === "auth/unverified-email") {
                setStep("email-verify")
            } else {
                setError(err.message || "Failed to generate QR code")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async () => {
        if (!secret || !verificationCode || verificationCode.length !== 6) {
            setError("Please enter a 6-digit code")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await enrollTotp(secret, verificationCode, "Authenticator App")
            setStep("success")
            setTimeout(() => {
                onSuccess()
                handleClose()
            }, 2000)
        } catch (err: any) {
            setError(err.message || "Invalid verification code. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setStep("qr")
        setQrCodeUrl("")
        setSecret(null)
        setVerificationCode("")
        setError(null)
        setEmailSent(false)
        onClose()
    }

    // Generate QR code when dialog opens
    useEffect(() => {
        if (open) {
            // Reset state
            setQrCodeUrl("")
            setSecret(null)
            setVerificationCode("")
            setError(null)
            setEmailSent(false)

            // Check if email is verified first
            if (isEmailVerified()) {
                setStep("qr")
                handleGenerateQR()
            } else {
                setStep("email-verify")
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Dialog open={open} onOpenChange={mandatory ? undefined : handleClose}>
            <DialogContent className="sm:max-w-md" hideCloseButton={mandatory}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        {step === "success" ? "2FA Enabled!" : "Enable Two-Factor Authentication"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "email-verify" && "Verify your email address first"}
                        {step === "qr" && "Scan the QR code with your authenticator app"}
                        {step === "verify" && "Enter the 6-digit code from your app"}
                        {step === "success" && "Your account is now more secure"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Email Verification Step */}
                    {step === "email-verify" && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <Envelope className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div className="text-sm text-foreground">
                                    <p className="font-medium mb-1">Email verification required</p>
                                    <p className="text-xs text-muted-foreground">
                                        Firebase requires a verified email before enabling 2FA. We&apos;ll send a verification link to <strong>{userEmail}</strong>.
                                    </p>
                                </div>
                            </div>

                            {emailSent && (
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                    <div className="text-sm text-foreground">
                                        <p className="font-medium mb-1">Verification email sent!</p>
                                        <p className="text-xs text-muted-foreground">
                                            Check your inbox and click the verification link. Then click the button below.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <WarningCircle className="w-4 h-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {!emailSent ? (
                                <Button
                                    onClick={handleSendVerificationEmail}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Verification Email"
                                    )}
                                </Button>
                            ) : (
                                <div className="space-y-2">
                                    <Button
                                        onClick={handleCheckEmailVerified}
                                        disabled={checkingEmail}
                                        className="w-full"
                                    >
                                        {checkingEmail ? (
                                            <>
                                                <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                                                Checking...
                                            </>
                                        ) : (
                                            "I've Verified My Email"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleSendVerificationEmail}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        {loading ? "Sending..." : "Resend Email"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* QR Code Step */}
                    {step === "qr" && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <DeviceMobile className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="text-sm text-foreground">
                                    <p className="font-medium mb-1">Step 1: Open your authenticator app</p>
                                    <p className="text-xs text-muted-foreground">
                                        Use Google Authenticator, Authy, Microsoft Authenticator, or any TOTP app
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <CircleNotch className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : qrCodeUrl ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-white rounded-xl border-2 border-border">
                                        <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground">
                                        Scan this QR code with your authenticator app
                                    </p>
                                </div>
                            ) : null}

                            {/* Error display for QR generation step */}
                            {error && !loading && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <WarningCircle className="w-4 h-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Retry button when QR generation fails */}
                            {error && !loading && !qrCodeUrl && (
                                <Button
                                    onClick={handleGenerateQR}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Retry
                                </Button>
                            )}

                            <Button
                                onClick={() => setStep("verify")}
                                disabled={!qrCodeUrl || loading}
                                className="w-full"
                            >
                                Next: Enter Verification Code
                            </Button>
                        </div>
                    )}

                    {/* Verification Step */}
                    {step === "verify" && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="text-sm text-foreground">
                                    <p className="font-medium mb-1">Step 2: Enter the 6-digit code</p>
                                    <p className="text-xs text-muted-foreground">
                                        The code changes every 30 seconds
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "")
                                        setVerificationCode(value)
                                    }}
                                    placeholder="000000"
                                    className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border text-foreground text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <WarningCircle className="w-4 h-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep("qr")}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleVerify}
                                    disabled={loading || verificationCode.length !== 6}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify & Enable 2FA"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Success Step */}
                    {step === "success" && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    Two-Factor Authentication Enabled!
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your account is now protected with 2FA
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
