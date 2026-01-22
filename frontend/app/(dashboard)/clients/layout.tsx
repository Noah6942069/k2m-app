"use client"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function ClientsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute adminOnly>
            {children}
        </ProtectedRoute>
    )
}
