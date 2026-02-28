"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus, PaperPlaneTilt, StopCircle } from "@phosphor-icons/react"
import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

interface ChatInputProps {
    inputValue: string
    setInputValue: (value: string) => void
    isInputCentered: boolean
    setIsInputCentered: (centered: boolean) => void
    isThinking: boolean
    onSendMessage: () => void
}

export function ChatInput({
    inputValue,
    setInputValue,
    isInputCentered,
    setIsInputCentered,
    isThinking,
    onSendMessage
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSendMessage()
        }
    }

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [inputValue])

    return (
        <div
            className={cn(
                "absolute left-0 right-0 transition-all duration-500 ease-in-out z-20 px-3 md:px-4",
                isInputCentered
                    ? "top-[52%] -translate-y-1/2 bg-transparent"
                    : "bottom-0 pt-6 md:pt-10 pb-4 md:pb-6"
            )}
            style={!isInputCentered && isDark ? {
                background: 'linear-gradient(to top, #080518 60%, transparent)'
            } : !isInputCentered ? {
                background: 'linear-gradient(to top, var(--background) 60%, transparent)'
            } : undefined}
        >
            <div className={cn(
                "mx-auto w-full relative transition-all duration-500",
                isInputCentered ? "max-w-2xl" : "max-w-3xl"
            )}>
                <div className="relative flex items-end gap-2 bg-muted/50 dark:bg-[#0b081f] rounded-full border border-border/40 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 transition-all hover:border-border/60">
                    <Button variant="ghost" size="icon" className="mb-2 ml-2 text-muted-foreground hover:text-foreground rounded-full transition-colors">
                        <Plus className="w-5 h-5" weight="duotone" />
                    </Button>
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Zeptejte se K2M AI..."
                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground border-none px-2 py-4 min-h-[52px] max-h-[200px] resize-none focus:ring-0 focus-visible:ring-0 focus:outline-none outline-none text-[16px] scrollbar-hide"
                        rows={1}
                    />
                    <div className="p-2 pb-2 mr-1">
                        <Button
                            onClick={onSendMessage}
                            disabled={!inputValue.trim() || isThinking}
                            size="icon"
                            className={cn(
                                "rounded-full w-8 h-8 transition-all duration-200",
                                inputValue.trim()
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            )}
                        >
                            {isThinking ? <StopCircle className="w-4 h-4" weight="duotone" /> : <PaperPlaneTilt className="w-4 h-4 ml-0.5" weight="duotone" />}
                        </Button>
                    </div>
                </div>
                <p className={cn(
                    "text-center text-[12px] text-muted-foreground mt-4 transition-opacity duration-300",
                    isInputCentered ? "opacity-0" : "opacity-100"
                )}>
                    K2M AI může dělat chyby. Důležité obchodní informace si prosím ověřte.
                </p>
            </div>
        </div>
    )
}
