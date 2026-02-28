"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { PencilSimple, SidebarSimple } from "@phosphor-icons/react"
import { PAST_CHATS } from "../data"

interface ChatSidebarProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    activeChatId: number | null
    setActiveChatId: (id: number | null) => void
    onNewChat: () => void
}

function SidebarContent({
    setSidebarOpen,
    activeChatId,
    setActiveChatId,
    onNewChat,
    onItemClick,
}: ChatSidebarProps & { onItemClick?: () => void }) {
    return (
        <>
            {/* New Chat & Toggle */}
            <div className="p-3 flex items-center justify-between bg-transparent z-50">
                <Button
                    onClick={() => {
                        onNewChat()
                        onItemClick?.()
                    }}
                    variant="ghost"
                    className="flex-1 justify-start gap-2 border border-border/40 hover:bg-muted text-foreground rounded-lg h-10 px-3 transition-colors text-sm"
                >
                    <PencilSimple className="w-4 h-4" weight="duotone" />
                    <span>Nový chat</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="ml-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors hidden md:flex"
                >
                    <SidebarSimple className="w-5 h-5" weight="duotone" />
                </Button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-border/40">
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3 pt-2">Dnes</h3>
                    {PAST_CHATS.filter(c => c.date === "Dnes").map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => {
                                setActiveChatId(chat.id)
                                onItemClick?.()
                            }}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors",
                                activeChatId === chat.id
                                    ? "bg-primary/15 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5"
                            )}
                        >
                            {chat.title}
                        </button>
                    ))}
                </div>
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3 pt-2">Včera</h3>
                    {PAST_CHATS.filter(c => c.date === "Včera").map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => {
                                setActiveChatId(chat.id)
                                onItemClick?.()
                            }}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors",
                                activeChatId === chat.id
                                    ? "bg-primary/15 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5"
                            )}
                        >
                            {chat.title}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export function ChatSidebar(props: ChatSidebarProps) {
    const { sidebarOpen, setSidebarOpen } = props
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)")
        setIsMobile(mq.matches)
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    return (
        <>
            {/* Desktop sidebar - inline */}
            <div
                className={cn(
                    "hidden md:flex flex-shrink-0 flex-col transition-all duration-300 ease-in-out",
                    sidebarOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-0 overflow-hidden",
                    "bg-sidebar",
                )}
            >
                <SidebarContent {...props} />
            </div>

            {/* Mobile sidebar - sheet overlay (only rendered on mobile) */}
            {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetContent side="left" className="w-[280px] p-0 bg-sidebar flex flex-col">
                        <SheetTitle className="sr-only">Chat History</SheetTitle>
                        <SidebarContent {...props} onItemClick={() => setSidebarOpen(false)} />
                    </SheetContent>
                </Sheet>
            )}
        </>
    )
}
