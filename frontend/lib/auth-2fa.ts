import {
    multiFactor,
    TotpMultiFactorGenerator,
    TotpSecret,
    MultiFactorResolver,
    MultiFactorError,
    sendEmailVerification,
    reauthenticateWithCredential,
    EmailAuthProvider,
    getMultiFactorResolver,
} from "firebase/auth"
import QRCode from "qrcode"
import { auth } from "./firebase"

/**
 * Check if the current user's email is verified
 */
export function isEmailVerified(): boolean {
    if (!auth || !auth.currentUser) return false
    return auth.currentUser.emailVerified
}

/**
 * Send email verification to the current user
 */
export async function sendVerificationEmail(): Promise<void> {
    if (!auth || !auth.currentUser) {
        throw new Error("User must be logged in")
    }
    await sendEmailVerification(auth.currentUser)
}

/**
 * Reload the current user to check if email is now verified
 */
export async function reloadUser(): Promise<boolean> {
    if (!auth || !auth.currentUser) return false
    await auth.currentUser.reload()
    return auth.currentUser.emailVerified
}

/**
 * Re-authenticate the current user with their password
 * Required before sensitive operations like MFA enrollment
 */
export async function reauthenticate(password: string): Promise<void> {
    if (!auth || !auth.currentUser || !auth.currentUser.email) {
        throw new Error("User must be logged in")
    }
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
    await reauthenticateWithCredential(auth.currentUser, credential)
}

/**
 * Generate a TOTP secret and QR code for user enrollment
 * This is the first step when a user wants to enable 2FA
 */
export async function generateTotpSecret(userEmail: string, password?: string): Promise<{
    secret: TotpSecret
    qrCodeUrl: string
}> {
    if (!auth || !auth.currentUser) {
        throw new Error("User must be logged in to enroll 2FA")
    }

    // Re-authenticate if password is provided (required for fresh session)
    if (password) {
        await reauthenticate(password)
    }

    const user = auth.currentUser
    const multiFactorSession = await multiFactor(user).getSession()

    // Generate TOTP secret
    const totpSecret = await TotpMultiFactorGenerator.generateSecret(multiFactorSession)

    // Generate QR code URL for the user to scan
    // Format: otpauth://totp/K2M:email?secret=SECRET&issuer=K2M
    const otpAuthUrl = totpSecret.generateQrCodeUrl(
        userEmail,
        "K2M Analytics" // Issuer name that appears in Google Authenticator
    )

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl)

    return {
        secret: totpSecret,
        qrCodeUrl: qrCodeDataUrl,
    }
}

/**
 * Verify the TOTP code and complete enrollment
 * User scans QR code, then enters the 6-digit code to verify
 */
export async function enrollTotp(
    secret: TotpSecret,
    verificationCode: string,
    displayName: string = "Authenticator App"
): Promise<void> {
    if (!auth || !auth.currentUser) {
        throw new Error("User must be logged in to enroll 2FA")
    }

    const user = auth.currentUser

    // Create the multi-factor assertion with the verification code
    const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(
        secret,
        verificationCode
    )

    // Enroll the user with the TOTP factor
    await multiFactor(user).enroll(multiFactorAssertion, displayName)
}

/**
 * Check if the current user has 2FA enabled
 */
export function is2FAEnabled(): boolean {
    if (!auth || !auth.currentUser) {
        return false
    }

    const user = auth.currentUser
    const enrolledFactors = multiFactor(user).enrolledFactors

    return enrolledFactors.length > 0
}

/**
 * Get list of enrolled 2FA factors
 */
export function getEnrolledFactors() {
    if (!auth || !auth.currentUser) {
        return []
    }

    const user = auth.currentUser
    return multiFactor(user).enrolledFactors
}

/**
 * Unenroll (disable) a specific 2FA factor
 */
export async function unenroll2FA(factorUid: string): Promise<void> {
    if (!auth || !auth.currentUser) {
        throw new Error("User must be logged in to unenroll 2FA")
    }

    const user = auth.currentUser
    const enrolledFactors = multiFactor(user).enrolledFactors

    const factorToUnenroll = enrolledFactors.find((f) => f.uid === factorUid)

    if (!factorToUnenroll) {
        throw new Error("Factor not found")
    }

    await multiFactor(user).unenroll(factorToUnenroll)
}

/**
 * Verify TOTP code during sign-in
 * This is called after email/password succeeds but 2FA is required
 */
export async function verifyTotpSignIn(
    resolver: MultiFactorResolver,
    verificationCode: string
): Promise<void> {
    const totpFactors = resolver.hints.filter(
        (hint) => hint.factorId === TotpMultiFactorGenerator.FACTOR_ID
    )

    if (totpFactors.length === 0) {
        throw new Error("No TOTP factor found")
    }

    const selectedFactor = totpFactors[0]

    const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(
        selectedFactor.uid,
        verificationCode
    )

    await resolver.resolveSignIn(multiFactorAssertion)
}

/**
 * Check if an error is a multi-factor authentication error
 */
export function isMultiFactorError(error: any): error is MultiFactorError {
    return error?.code === "auth/multi-factor-auth-required"
}

/**
 * Extract the resolver from a multi-factor error
 */
export function getResolverFromError(error: MultiFactorError): MultiFactorResolver {
    if (!auth) {
        throw new Error("Firebase auth not initialized")
    }
    return getMultiFactorResolver(auth, error)
}
