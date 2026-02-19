    "use client"

import { useState } from "react"
import { User, Palette, Bell, Shield, Check, Moon, Sun, Globe } from "@phosphor-icons/react"
import { useTranslation } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    const { t, language, setLanguage } = useTranslation()
    const { user } = useAuth()
    const { theme, setTheme } = useTheme()

    // Local state for toggles (demo purposes)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [weeklyDigest, setWeeklyDigest] = useState(false)
    const [analyticsSharing, setAnalyticsSharing] = useState(true)
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const sections = [
        {
            id: "profile",
            title: t.settings.profile,
            description: t.settings.profileDesc,
            icon: User,
            color: "blue"
        },
        {
            id: "appearance",
            title: t.settings.appearance,
            description: t.settings.appearanceDesc,
            icon: Palette,
            color: "violet"
        },
        {
            id: "notifications",
            title: t.settings.notifications,
            description: t.settings.notificationsDesc,
            icon: Bell,
            color: "amber"
        },
        {
            id: "privacy",
            title: t.settings.dataPrivacy,
            description: t.settings.dataPrivacyDesc,
            icon: Shield,
            color: "emerald"
        },
    ]

    return (
        <div className="flex-1 p-6 space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t.settings.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t.settings.subtitle}
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary/90"
                >
                    {saved ? (
                        <>
                            <Check className="w-4 h-4 mr-2" weight="duotone" />
                            {t.settings.changesSaved}
                        </>
                    ) : (
                        t.settings.saveChanges
                    )}
                </Button>
            </div>

            {/* Profile Section */}
            <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-sm shadow-blue-500/5">
                        <User className="w-5 h-5 text-blue-500" weight="duotone" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-foreground">{t.settings.profile}</h2>
                        <p className="text-xs text-muted-foreground">{t.settings.profileDesc}</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t.settings.displayName}</label>
                        <div className="px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground">
                            {user?.displayName || "User"}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t.settings.email}</label>
                        <div className="px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground">
                            {user?.email || "user@example.com"}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t.settings.role}</label>
                        <div className="px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground">
                            Admin
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t.settings.company}</label>
                        <div className="px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground">
                            K2M Analytics
                        </div>
                    </div>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-sm shadow-violet-500/5">
                        <Palette className="w-5 h-5 text-violet-500" weight="duotone" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-foreground">{t.settings.appearance}</h2>
                        <p className="text-xs text-muted-foreground">{t.settings.appearanceDesc}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? (
                                <Moon className="w-5 h-5 text-violet-500" weight="duotone" />
                            ) : (
                                <Sun className="w-5 h-5 text-amber-500" weight="duotone" />
                            )}
                            <div>
                                <p className="text-sm font-medium text-foreground">{t.settings.theme}</p>
                                <p className="text-xs text-muted-foreground">{t.settings.themeDesc}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setTheme('light')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${theme === 'light'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${theme === 'dark'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Dark
                            </button>
                        </div>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-blue-500" weight="duotone" />
                            <div>
                                <p className="text-sm font-medium text-foreground">{t.settings.language}</p>
                                <p className="text-xs text-muted-foreground">{t.settings.languageDesc}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${language === 'en'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLanguage('cs')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${language === 'cs'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Čeština
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-sm shadow-amber-500/5">
                        <Bell className="w-5 h-5 text-amber-500" weight="duotone" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-foreground">{t.settings.notifications}</h2>
                        <p className="text-xs text-muted-foreground">{t.settings.notificationsDesc}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                        <div>
                            <p className="text-sm font-medium text-foreground">{t.settings.emailNotifications}</p>
                            <p className="text-xs text-muted-foreground">{t.settings.emailNotificationsDesc}</p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                        <div>
                            <p className="text-sm font-medium text-foreground">{t.settings.pushNotifications}</p>
                            <p className="text-xs text-muted-foreground">{t.settings.pushNotificationsDesc}</p>
                        </div>
                        <Switch
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                        <div>
                            <p className="text-sm font-medium text-foreground">{t.settings.weeklyDigest}</p>
                            <p className="text-xs text-muted-foreground">{t.settings.weeklyDigestDesc}</p>
                        </div>
                        <Switch
                            checked={weeklyDigest}
                            onCheckedChange={setWeeklyDigest}
                        />
                    </div>
                </div>
            </div>

            {/* Data & Privacy Section */}
            <div className="rounded-2xl bg-card border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm shadow-emerald-500/5">
                        <Shield className="w-5 h-5 text-emerald-500" weight="duotone" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-foreground">{t.settings.dataPrivacy}</h2>
                        <p className="text-xs text-muted-foreground">{t.settings.dataPrivacyDesc}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                        <div>
                            <p className="text-sm font-medium text-foreground">{t.settings.dataRetention}</p>
                            <p className="text-xs text-muted-foreground">{t.settings.dataRetentionDesc}</p>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-medium">
                            90 {t.settings.days}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
                        <div>
                            <p className="text-sm font-medium text-foreground">{t.settings.analyticsSharing}</p>
                            <p className="text-xs text-muted-foreground">{t.settings.analyticsSharingDesc}</p>
                        </div>
                        <Switch
                            checked={analyticsSharing}
                            onCheckedChange={setAnalyticsSharing}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}
