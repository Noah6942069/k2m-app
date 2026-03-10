"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowRight, ChartLineUp, Brain, ShieldCheck, Database, Lightning, Users } from "@phosphor-icons/react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#04010e] text-white overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(124, 92, 252, 0.15) 0%, rgba(45, 29, 146, 0.05) 40%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(94, 67, 216, 0.1) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(124, 92, 252, 0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/k2m-logo-new.png"
            alt="K2M Analytics"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Funkce</Link>
          <Link href="#about" className="hover:text-white transition-colors">O platforme</Link>
          <Link href="#contact" className="hover:text-white transition-colors">Kontakt</Link>
        </div>
        <Link 
          href="/login"
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-200"
        >
          Prihlasit se
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 lg:pt-24 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text Content */}
            <div className={`space-y-8 ${mounted ? 'animate-in fade-in slide-in-from-left-8 duration-700' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-sm text-[#B49DFE]">
                <Lightning weight="fill" className="w-4 h-4" />
                <span>AI-Powered Business Intelligence</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-balance">
                Premente data na
                <span className="block mt-2 bg-gradient-to-r from-[#7C5CFC] via-[#9F84FD] to-[#B49DFE] bg-clip-text text-transparent">
                  akcni rozhodnuti
                </span>
              </h1>
              
              <p className="text-lg text-white/50 leading-relaxed max-w-lg">
                K2M Analytics je vase platforma pro analyzu dat pomoci umele inteligence. 
                Ziskejte hlubsi prehled o vasem podnikani a objevte skryte prilezitosti.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#7C5CFC] text-white font-semibold hover:bg-[#6B4EE6] transition-all duration-200 shadow-lg shadow-[#7C5CFC]/25"
                >
                  Zacit nyni
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/80 font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-200"
                >
                  Zjistit vice
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/40">Presnost AI</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">10x</div>
                  <div className="text-sm text-white/40">Rychlejsi analyza</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white/40">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className={`relative ${mounted ? 'animate-in fade-in slide-in-from-right-8 duration-700 delay-200' : 'opacity-0'}`}>
              <div className="relative aspect-square max-w-xl mx-auto">
                {/* Glow effect behind image */}
                <div 
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(124, 92, 252, 0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                />
                <Image
                  src="/images/hero-dashboard.jpg"
                  alt="K2M Analytics Dashboard"
                  fill
                  className="object-cover rounded-3xl border border-white/10"
                  priority
                />
                {/* Floating card overlay */}
                <div className="absolute -bottom-6 -left-6 bg-[#0d0a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#5E43D8] flex items-center justify-center">
                      <ChartLineUp className="w-5 h-5 text-white" weight="bold" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">+127%</div>
                      <div className="text-xs text-white/40">Narust trzeb</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-24 bg-gradient-to-b from-transparent via-[#0d0a1a]/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Vsechno co potrebujete
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Komplexni sada nastroju pro analyzu dat, predikci a automatizaci
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Analyza",
                description: "Umela inteligence automaticky analyzuje vase data a odhaluje skryte vzorce."
              },
              {
                icon: ChartLineUp,
                title: "Predikcni modely",
                description: "Predpovidejte trendy a budouci vyvoj vaseho podnikani s vysokou presnosti."
              },
              {
                icon: ShieldCheck,
                title: "Rizikova analyza",
                description: "Identifikujte potencialni rizika drive nez ovlivni vas byznys."
              },
              {
                icon: Database,
                title: "Sprava datasetu",
                description: "Jednoduse nahravejte, spravujte a transformujte vase datove sady."
              },
              {
                icon: Lightning,
                title: "Realtime dashboard",
                description: "Sledujte klicove metriky v realnem case na interaktivnich dashboardech."
              },
              {
                icon: Users,
                title: "Tymova spoluprace",
                description: "Sdilejte analyzy a reporty s vasim tymem bezpecne a efektivne."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#7C5CFC]/30 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C5CFC]/20 to-[#5E43D8]/10 flex items-center justify-center mb-4 group-hover:from-[#7C5CFC]/30 group-hover:to-[#5E43D8]/20 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-[#9F84FD]" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section id="about" className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="/images/ai-insights.jpg"
                  alt="AI-Powered Insights"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04010e] via-transparent to-transparent" />
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-sm text-[#B49DFE]">
                <Brain weight="fill" className="w-4 h-4" />
                <span>Umela inteligence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Nechte AI pracovat za vas
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                Nase pokrocile AI modely analyzuji miliony datovych bodu behem sekund. 
                Ziskejte relevantni doporuceni a automaticke reporty bez slozitych nastaveni.
              </p>
              <ul className="space-y-4">
                {[
                  "Automaticka detekce anomalii",
                  "Prirozeny jazyk pro dotazy",
                  "Personalizovana doporuceni",
                  "Kontinualni uceni z vasich dat"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#7C5CFC]/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#7C5CFC]" />
                    </div>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[#9F84FD] font-medium hover:text-[#B49DFE] transition-colors"
              >
                Vyzkousejte zdarma
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="relative rounded-3xl p-12 lg:p-16 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 92, 252, 0.15) 0%, rgba(45, 29, 146, 0.1) 100%)',
              border: '1px solid rgba(124, 92, 252, 0.2)',
            }}
          >
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at top right, rgba(124, 92, 252, 0.2) 0%, transparent 50%)',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Pripraveni transformovat vase data?
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                Pridejte se k firmam, ktere uz vyuzivaji K2M Analytics pro lepsi rozhodovani.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#04010e] font-semibold hover:bg-white/90 transition-all duration-200"
              >
                Zacit nyni
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/k2m-logo-new.png"
              alt="K2M Analytics"
              width={100}
              height={28}
              className="h-6 w-auto opacity-50"
            />
          </div>
          <p className="text-sm text-white/30">
            © 2026 K2M Analytics. Vsechna prava vyhrazena.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="#" className="hover:text-white/60 transition-colors">Podminky</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Soukromi</Link>
            <Link href="#contact" className="hover:text-white/60 transition-colors">Kontakt</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
