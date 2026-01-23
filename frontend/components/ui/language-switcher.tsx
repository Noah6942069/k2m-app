"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>

                    {/* Small indicator of current lang */}
                    <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-primary text-primary-foreground px-1 rounded-full uppercase">
                        {language}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className="gap-2">
                    <span className="text-lg">🇺🇸</span> English
                    {language === "en" && <span className="ml-auto text-xs opacity-50">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("cs")} className="gap-2">
                    <span className="text-lg">🇨🇿</span> Čeština
                    {language === "cs" && <span className="ml-auto text-xs opacity-50">✓</span>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
