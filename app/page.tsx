'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Clock, Users, ArrowRight, Home, Wrench, Palette, Sparkles, Brain, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Estimation Rénovation.AI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-muted-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#projets" className="text-muted-foreground hover:text-primary transition-colors">
              Projets
            </a>
            <a href="#temoignages" className="text-muted-foreground hover:text-primary transition-colors">
              Témoignages
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Estimation Gratuite IA</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary text-primary-foreground border-primary hover:bg-primary/90">
                  🤖 Intelligence Artificielle + Expertise Québécoise
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                  Visualisez votre <span className="text-primary">rénovation de rêve</span> avec l'IA en 60 secondes
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Notre IA génère des visualisations 3D photoréalistes et calcule automatiquement les coûts de rénovation selon le marché québécois 2025.
                </p>
              </div>

              <div className="flex justify-center sm:justify-start">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-3xl px-16 py-10 h-auto w-full sm:w-auto" onClick={() => window.location.href = '/renovation'}>
                  Commencer Mon Projet
                  <ArrowRight className="ml-4 h-8 w-8" />
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                      >
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">500+ Clients Satisfaits</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">4.9/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/luxury-modern-bathroom-renovation-with-marble-tile.jpg"
                  alt="Rénovation de salle de bain luxueuse"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>

              {/* Floating Stats Cards */}
              <Card className="absolute -bottom-6 -left-6 bg-background/95 backdrop-blur border-border shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">60s</p>
                      <p className="text-sm text-muted-foreground">Estimation IA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="absolute -top-6 -right-6 bg-background/95 backdrop-blur border-border shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">100%</p>
                      <p className="text-sm text-muted-foreground">Garantie</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary text-primary-foreground border-primary">Nos Services</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-balance">L'IA au service de votre rénovation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Technologie de pointe et expertise québécoise pour visualiser et estimer votre projet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Visualisation IA 3D",
                description: "Transformez vos photos en rendus 3D photoréalistes avec Nano Banana (Gemini 2.5 Flash Image)",
                image: "/modern-luxury-kitchen-renovation.jpg",
              },
              {
                icon: Zap,
                title: "Estimation Automatique",
                description: "Calcul instantané des coûts selon les tarifs québécois 2025",
                image: "/elegant-living-room-interior-design.jpg",
              },
              {
                icon: Sparkles,
                title: "Conseils d'Expert IA",
                description: "Recommandations personnalisées par style et type de pièce",
                image: "/luxury-bedroom-renovation.jpg",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <service.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-primary-foreground hover:bg-primary p-0 h-auto font-semibold"
                    >
                      En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-secondary text-secondary-foreground border-secondary">Technologie IA</Badge>
                <h2 className="text-3xl lg:text-5xl font-bold text-balance">L'intelligence artificielle au service de votre projet</h2>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Notre plateforme combine les dernières avancées en IA avec l'expertise du marché québécois.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Brain,
                    title: "IA Avancée",
                    description: "Nano Banana (Gemini 2.5 Flash Image) pour des visualisations et estimations précises",
                  },
                  {
                    icon: Shield,
                    title: "Prix Québécois Réels",
                    description: "Tarifs main-d'œuvre et matériaux actualisés pour le marché 2025",
                  },
                  {
                    icon: Zap,
                    title: "Résultats Instantanés",
                    description: "Visualisation 3D et estimation complète en moins de 60 secondes",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => window.location.href = '/renovation'}>
                Essayer l'IA Maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <img
                src="/professional-contractor-team-working-on-luxury-hom.jpg"
                alt="Équipe d'entrepreneurs professionnels"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-balance text-white">
              Prêt à visualiser votre rénovation ?
            </h2>
            <p className="text-xl opacity-90 text-pretty leading-relaxed text-white">
              Découvrez le pouvoir de l'IA : visualisation 3D + estimation précise en 60 secondes chrono.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-3xl px-16 py-10 h-auto w-full max-w-md"
                onClick={() => window.location.href = '/renovation'}
              >
                Commencer Mon Projet
                <ArrowRight className="ml-4 h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Estimation Rénovation.AI</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Plateforme IA de visualisation 3D et d'estimation de coûts pour vos projets de rénovation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services IA</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Visualisation 3D
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Estimation Coûts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Conseils Expert
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    À Propos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Nos Garanties
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Témoignages
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>01 23 45 67 89</li>
                <li>contact@estimation-renovation.ai</li>
                <li>Québec, Canada</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Estimation Rénovation.AI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
