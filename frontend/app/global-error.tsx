"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Global Error:", error)
    }, [error])

    return (
        <html>
            <body className="bg-[#0d0d12] text-white min-h-screen flex items-center justify-center p-4 font-sans">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter">Something went wrong</h1>
                        <p className="text-zinc-400">
                            The application encountered an unexpected error. This usually happens when a new version has been deployed.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full bg-[#7c5cfc] hover:bg-[#6b4ce0] text-white"
                        >
                            Reload Application
                        </Button>
                        <p className="text-xs text-zinc-600">
                            Error Code: {error.digest || "Unknown"}
                        </p>
                    </div>
                </div>
            </body>
        </html>
    )
}
