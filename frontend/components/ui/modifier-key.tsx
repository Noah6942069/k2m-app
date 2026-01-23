"use client"

import { useEffect, useState } from "react"

export function ModifierKey({ className }: { className?: string }) {
    const [isMac, setIsMac] = useState(true)

    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }, [])

    return (
        <span className={className} suppressHydrationWarning>
            {typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') < 0 ? "Ctrl" : "⌘"}
        </span>
    )
}
