"use client"

import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useState, useEffect } from "react"
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Database,
    Palette,
    Trash2,
    Download,
    Save,
    Upload,
    Mail,
    Smartphone,
    CheckCircle,
    Globe,
    Shield,
    Key,
    Eye,
    EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const [clearConfirm, setClearConfirm] = useState(false)
    const [clearing, setClearing] = useState(false)
    const [cleared, setCleared] = useState(false)
    const { theme } = useTheme()
    const { user } = useAuth()
    const [mounted, setMounted] = useState(false)

    // Account state
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Notification state
    const [emailNotifs, setEmailNotifs] = useState(true)
    const [pushNotifs, setPushNotifs] = useState(false)
    const [marketingEmails, setMarketingEmails] = useState(false)
    const [securityAlerts, setSecurityAlerts] = useState(true)
    const [productUpdates, setProductUpdates] = useState(true)

    // Security state
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (user) {
            setDisplayName(user.displayName || "")
            setEmail(user.email || "")
        }

        // Load notification preferences from localStorage
        const savedPrefs = localStorage.getItem("k2m-notification-prefs")
        if (savedPrefs) {
            const prefs = JSON.parse(savedPrefs)
            setEmailNotifs(prefs.email ?? true)
            setPushNotifs(prefs.push ?? false)
            setMarketingEmails(prefs.marketing ?? false)
            setSecurityAlerts(prefs.security ?? true)
            setProductUpdates(prefs.updates ?? true)
        }
    }, [user])

    const saveProfile = async () => {
        setSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const saveNotificationPrefs = () => {
        const prefs = {
            email: emailNotifs,
            push: pushNotifs,
            marketing: marketingEmails,
            security: securityAlerts,
            updates: productUpdates
        }
        localStorage.setItem("k2m-notification-prefs", JSON.stringify(prefs))
    }

    const clearAllData = async () => {
        setClearing(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
            if (res.ok) {
                const datasets = await res.json()
                for (const ds of datasets) {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/${ds.id}`, { method: "DELETE" })
                }
            }
            setCleared(true)
            setClearConfirm(false)
        } catch (error) {
            console.error("Failed to clear data", error)
        } finally {
            setClearing(false)
        }
    }

    const exportData = () => {
        // Simulate data export
        const data = {
            user: { name: displayName, email },
            exportDate: new Date().toISOString(),
            message: "This is a simulated data export"
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'k2m-data-export.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    if (!mounted) return null

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-muted-foreground mt-2">Manage your K2M Analytics preferences and account</p>
            </div>

            {/* Tabbed Interface */}
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="general" className="gap-2">
                        <SettingsIcon className="w-4 h-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="account" className="gap-2">
                        <User className="w-4 h-4" />
                        Account
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                        <Palette className="w-4 h-4" />
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="data" className="gap-2">
                        <Database className="w-4 h-4" />
                        Data
                    </TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general">
                    <div className="space-y-6">
                        {/* App Info */}
                        <div className="rounded-2xl bg-card border border-border overflow-hidden">
                            <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20">
                                        <SettingsIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">K2M Analytics</h2>
                                        <p className="text-sm text-muted-foreground">Version 2.1.0 • Enterprise Edition</p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-border">
                                <div className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Language</p>
                                            <p className="text-xs text-muted-foreground">Choose your preferred language</p>
                                        </div>
                                    </div>
                                    <LanguageSwitcher />
                                </div>

                                <div className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-3">
                                        <Database className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Storage</p>
                                            <p className="text-xs text-muted-foreground">Backend API connection</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                        Connected
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account">
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Profile Information</h3>

                            {/* Avatar */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative">
                                    <Avatar className="w-20 h-20">
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                                            {displayName?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    </Avatar>
                                    <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center border-2 border-background shadow-lg transition-colors">
                                        <Upload className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Profile Picture</p>
                                    <p className="text-xs text-muted-foreground">Click to upload a new photo</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="displayName" className="text-sm font-medium text-foreground">Display Name</Label>
                                        <Input
                                            id="displayName"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="mt-1.5 input-glow"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-1.5 input-glow"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-foreground">Role</Label>
                                    <div className="mt-1.5 px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
                                        Administrator
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    {saved ? (
                                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                                            <CheckCircle className="w-4 h-4" />
                                            Saved successfully
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={saveProfile}
                                            disabled={saving}
                                            className="btn-primary-glow"
                                        >
                                            {saving ? (
                                                <>Saving...</>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                Security
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="oldPassword" className="text-sm font-medium text-foreground">Current Password</Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="oldPassword"
                                            type={showOldPassword ? "text" : "password"}
                                            className="pr-10"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            className="pr-10"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full" disabled>
                                    <Key className="w-4 h-4 mr-2" />
                                    Update Password (Coming Soon)
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance">
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Theme Preferences</h3>
                            <ThemeSelector />
                        </div>

                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Theme Toggle</h3>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Dark Mode</p>
                                    <p className="text-xs text-muted-foreground">Current: <span className="capitalize">{theme}</span></p>
                                </div>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Notification Channels</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Email Notifications</p>
                                            <p className="text-xs text-muted-foreground">Receive updates via email</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={emailNotifs}
                                        onCheckedChange={(checked) => {
                                            setEmailNotifs(checked)
                                            saveNotificationPrefs()
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Push Notifications</p>
                                            <p className="text-xs text-muted-foreground">Browser push notifications</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={pushNotifs}
                                        onCheckedChange={(checked) => {
                                            setPushNotifs(checked)
                                            saveNotificationPrefs()
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Email Preferences</h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Marketing Emails</p>
                                        <p className="text-xs text-muted-foreground">Product news and offers</p>
                                    </div>
                                    <Switch
                                        checked={marketingEmails}
                                        onCheckedChange={(checked) => {
                                            setMarketingEmails(checked)
                                            saveNotificationPrefs()
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Security Alerts</p>
                                        <p className="text-xs text-muted-foreground">Important account security updates</p>
                                    </div>
                                    <Switch
                                        checked={securityAlerts}
                                        onCheckedChange={(checked) => {
                                            setSecurityAlerts(checked)
                                            saveNotificationPrefs()
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Product Updates</p>
                                        <p className="text-xs text-muted-foreground">New features and improvements</p>
                                    </div>
                                    <Switch
                                        checked={productUpdates}
                                        onCheckedChange={(checked) => {
                                            setProductUpdates(checked)
                                            saveNotificationPrefs()
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Data Tab */}
                <TabsContent value="data">
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>

                            <div className="space-y-4">
                                {/* Export */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-accent/50 border border-border">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Export All Data</p>
                                        <p className="text-xs text-muted-foreground">Download your data as JSON</p>
                                    </div>
                                    <Button onClick={exportData} variant="outline" size="sm" className="btn-glow">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </Button>
                                </div>

                                {/* Clear Data */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Clear All Data</p>
                                        <p className="text-xs text-muted-foreground">Delete all datasets and reset</p>
                                    </div>
                                    {cleared ? (
                                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                                            <CheckCircle className="w-4 h-4" />
                                            Cleared
                                        </div>
                                    ) : clearConfirm ? (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setClearConfirm(false)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={clearAllData}
                                                disabled={clearing}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                {clearing ? "Clearing..." : "Confirm"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            onClick={() => setClearConfirm(true)}
                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-0"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Clear Data
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Storage Info */}
                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Storage Information</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">Database</span>
                                    <span className="font-medium text-foreground">SQLite (Local)</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">API Backend</span>
                                    <span className="font-medium text-emerald-400">Connected</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">Data Retention</span>
                                    <span className="font-medium text-foreground">Unlimited</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
