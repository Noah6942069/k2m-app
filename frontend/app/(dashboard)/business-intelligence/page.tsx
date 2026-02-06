"use client"

export default function BusinessIntelligencePage() {
    return (
        <div className="flex-1 min-h-screen p-6 md:p-10">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Business Intelligence</h1>
                <p className="text-muted-foreground">
                    Analytické nástroje pro vaše podnikání
                </p>
            </div>

            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Připravujeme</h2>
                    <p className="text-muted-foreground max-w-md">
                        Tato stránka je momentálně ve vývoji. Brzy zde najdete komplexní analytické nástroje.
                    </p>
                </div>
            </div>
        </div>
    )
}
