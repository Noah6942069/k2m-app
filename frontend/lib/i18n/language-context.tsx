"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { en, cs, Dictionary } from "./dictionaries"

type Language = "en" | "cs"

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: Dictionary
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Load persisted language preference
        try {
            const savedLang = localStorage.getItem("k2m-language") as Language
            if (savedLang && (savedLang === "en" || savedLang === "cs")) {
                setLanguageState(savedLang)
            }
        } catch (e) {
            console.error("Failed to load language preference", e)
        }
    }, [])

    let activeDict = en

    // Safety check for dictionary
    if (!activeDict) {
        console.error("CRITICAL: English dictionary is undefined. Check dictionaries.ts exports.")
        // Minimal fallback to prevent crash
        activeDict = {
            common: {},
            navigation: {},
            home: {},
            overview: {},
            bi: {},
            clients: {},
            datasets: {},
            auth: {}
        } as any
    }

    if (language === "cs") {
        if (cs) {
            activeDict = cs
        } else {
            console.warn("Czech dictionary not found, falling back to English")
        }
    }

    const t = activeDict

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        try {
            localStorage.setItem("k2m-language", lang)
        } catch (e) {
            // Ignore
        }
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useTranslation must be used within a LanguageProvider")
    }
    return context
}
