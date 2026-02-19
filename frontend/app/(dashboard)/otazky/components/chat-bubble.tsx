import { cn } from "@/lib/utils"
import { Sparkle } from "@phosphor-icons/react"

interface ChatBubbleProps {
    role: string
    content: string
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
    return (
        <div
            className={cn(
                "flex gap-4 group w-full",
                role === "user" ? "justify-end" : "justify-start"
            )}
        >
            {/* Bot Avatar (Only for Assistant) */}
            {role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-primary/20">
                    <Sparkle className="w-5 h-5 text-white" weight="duotone" />
                </div>
            )}

            {/* Content */}
            <div className={cn(
                "relative max-w-[85%] text-[16px] leading-7",
                role === "user"
                    ? "bg-muted/50 dark:bg-[#1a1f2e] text-foreground border border-border/50 px-5 py-2.5 rounded-3xl rounded-tr-sm"
                    : "text-foreground px-1 py-1"
            )}>
                {content}
            </div>
        </div>
    )
}
