"use client"

import { useEffect, useState } from "react"

export function Kbd({ children, className }: { children?: React.ReactNode, className?: string }) {
    const [isMac, setIsMac] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }, [])

    if (!mounted) {
        return <span className={className}>CTRL</span> // Default to CTRL to avoid hydration offset, or maybe empty? sticking to one.
    }

    return (
        <span className={className}>
            {children ? children : (isMac ? "⌘" : "Ctrl")}
        </span>
    )
}
