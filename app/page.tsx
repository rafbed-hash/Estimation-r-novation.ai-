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

      {/* Hero Section - HomeAdvisor Style */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <Badge className="bg-primary text-primary-foreground border-primary hover:bg-primary/90">
                🍁 Trouvez des professionnels certifiés au Québec
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Trouvez des <span className="text-primary">professionnels certifiés</span> dans votre région
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
                Connectez-vous avec des entrepreneurs qualifiés au Québec. Visualisation IA + estimation précise + professionnels vérifiés.
              </p>
            </div>

            {/* Search Bar HomeAdvisor Style */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-border max-w-2xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Quel type de projet avez-vous ?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: "Plomberie", icon: "🔧" },
                    { name: "Électricité", icon: "⚡" },
                    { name: "Thermopompe", icon: "🌡️" },
                    { name: "Cuisine", icon: "🏠" },
                    { name: "Salle de bain", icon: "🚿" },
                    { name: "Ventilation", icon: "💨" }
                  ].map((service) => (
                    <Button
                      key={service.name}
                      variant="outline"
                      className="h-16 flex-col space-y-1 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => window.location.href = '/renovation'}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <span className="text-sm">{service.name}</span>
                    </Button>
                  ))}
                </div>
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => window.location.href = '/renovation'}
                >
                  Commencer Mon Projet avec l'IA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex justify-center items-center space-x-8 pt-8">
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
        </div>
      </section>

      {/* Popular Projects Section - HomeAdvisor Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Projets populaires au Québec</h2>
            <p className="text-lg text-muted-foreground">Services les plus demandés avec nos professionnels certifiés</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Rénovation Salle de Bain",
                rating: "4.8",
                reviews: "1.2k+",
                price: "à partir de 8 500$",
                icon: "🚿",
                popular: true
              },
              {
                name: "Installation Thermopompe",
                rating: "4.9",
                reviews: "850+",
                price: "à partir de 4 500$",
                icon: "🌡️",
                popular: true
              },
              {
                name: "Rénovation Cuisine",
                rating: "4.7",
                reviews: "2.1k+",
                price: "à partir de 15 000$",
                icon: "🏠",
                popular: false
              },
              {
                name: "Services Plomberie",
                rating: "4.6",
                reviews: "3.2k+",
                price: "à partir de 275$",
                icon: "🔧",
                popular: false
              },
              {
                name: "Travaux Électriques",
                rating: "4.7",
                reviews: "1.8k+",
                price: "à partir de 320$",
                icon: "⚡",
                popular: false
              },
              {
                name: "Isolation & Ventilation",
                rating: "4.5",
                reviews: "650+",
                price: "à partir de 2 500$",
                icon: "💨",
                popular: false
              }
            ].map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-border/50 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{project.icon}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        {project.popular && (
                          <Badge className="bg-secondary text-secondary-foreground text-xs">Populaire</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span className="ml-1 font-semibold">{project.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({project.reviews} avis)</span>
                    </div>
                    
                    <p className="text-primary font-semibold text-lg">{project.price} CAD</p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => window.location.href = '/renovation'}
                    >
                      Obtenir une estimation IA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Guides 2025 Section - HomeAdvisor Style */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-primary text-primary-foreground border-primary">Guides de Coûts 2025</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">Combien coûte votre projet au Québec ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Prix actualisés 2025 incluant main-d'œuvre, matériaux et taxes québécoises
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Rénovation Cuisine Complète",
                minPrice: "15 000",
                maxPrice: "45 000",
                avgPrice: "28 000",
                factors: ["Superficie", "Électroménagers", "Comptoirs", "Armoires"],
                image: "/modern-luxury-kitchen-renovation.jpg",
                popular: true
              },
              {
                title: "Rénovation Salle de Bain",
                minPrice: "8 500",
                maxPrice: "25 000",
                avgPrice: "15 500",
                factors: ["Carrelage", "Plomberie", "Douche/Bain", "Vanité"],
                image: "/luxury-modern-bathroom-renovation-with-marble-tile.jpg",
                popular: true
              },
              {
                title: "Installation Thermopompe",
                minPrice: "4 500",
                maxPrice: "12 000",
                avgPrice: "7 500",
                factors: ["Type", "Superficie", "Installation", "Subventions"],
                image: "/professional-contractor-team-working-on-luxury-hom.jpg",
                popular: false
              },
              {
                title: "Travaux Électriques",
                minPrice: "320",
                maxPrice: "8 500",
                avgPrice: "2 400",
                factors: ["Panneau", "Prises", "Éclairage", "Mise aux normes"],
                image: "/elegant-living-room-interior-design.jpg",
                popular: false
              },
              {
                title: "Services Plomberie",
                minPrice: "275",
                maxPrice: "6 500",
                avgPrice: "1 800",
                factors: ["Urgence", "Réparation", "Installation", "Matériaux"],
                image: "/luxury-bedroom-renovation.jpg",
                popular: false
              },
              {
                title: "Isolation & Ventilation",
                minPrice: "2 500",
                maxPrice: "15 000",
                avgPrice: "7 200",
                factors: ["Superficie", "Type isolation", "Ventilation", "Étanchéité"],
                image: "/abstract-geometric-shapes.png",
                popular: false
              }
            ].map((guide, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden">
                <div className="relative">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-48 object-cover"
                  />
                  {guide.popular && (
                    <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                      Guide Populaire
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-bold text-lg">{guide.title}</h3>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Coût moyen :</span>
                      <span className="text-2xl font-bold text-primary">{guide.avgPrice}$ CAD</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Min: {guide.minPrice}$</span>
                      <span className="text-muted-foreground">Max: {guide.maxPrice}$</span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(parseInt(guide.avgPrice.replace(/\s/g, '')) - parseInt(guide.minPrice.replace(/\s/g, ''))) / (parseInt(guide.maxPrice.replace(/\s/g, '')) - parseInt(guide.minPrice.replace(/\s/g, ''))) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Facteurs de coût :</h4>
                    <div className="flex flex-wrap gap-1">
                      {guide.factors.map((factor, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => window.location.href = '/renovation'}
                    >
                      Estimation IA Gratuite
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-sm"
                      onClick={() => window.location.href = '/renovation'}
                    >
                      Guide Complet 2025
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-4">💡 Pourquoi nos estimations sont précises ?</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="text-primary font-semibold">🍁 Marché Québécois</div>
                  <p className="text-muted-foreground">Prix actualisés selon les tarifs 2025 au Québec</p>
                </div>
                <div className="space-y-2">
                  <div className="text-primary font-semibold">🤖 IA Avancée</div>
                  <p className="text-muted-foreground">Analyse photo + dimensions pour estimation précise</p>
                </div>
                <div className="space-y-2">
                  <div className="text-primary font-semibold">📊 Données Réelles</div>
                  <p className="text-muted-foreground">Basé sur 500+ projets réalisés au Québec</p>
                </div>
              </div>
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
                description: "Transformez vos photos en rendus 3D photoréalistes avec Google AI Studio",
                image: "/modern-luxury-kitchen-renovation.jpg",
              },
              {
                icon: Zap,
                title: "Estimation Automatique",
                description: "Calcul instantané des coûts en $ CAD selon les tarifs québécois 2025",
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
                    description: "Google AI Studio pour des visualisations et estimations précises",
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
                <li>(514) 123-4567</li>
                <li>contact@estimation-renovation.ai</li>
                <li>Montréal, Québec, Canada</li>
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
