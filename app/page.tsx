'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search, MapPin, Home, Wrench, Hammer, Zap, Droplets, Wind, Paintbrush, Building, Snowflake, ArrowRight, Users, Brain, Sparkles, Shield, Camera } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Style HomeAdvisor */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">estimation-rénovation.ai</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/renovation" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Intérieur
            </a>
            <a href="/renovation" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Extérieur
            </a>
            <a href="/renovation" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Plus
            </a>
            <a href="/renovation" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Articles & conseils
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
              English
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
              Français
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white px-6"
              onClick={() => window.location.href = '/renovation'}
            >
              S'inscrire
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Exact HomeAdvisor Style */}
      <section className="relative h-96 bg-cover bg-center" style={{
        backgroundImage: "url('/modern-luxury-kitchen-renovation.jpg')"
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl text-white space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Trouvez des pros certifiés<br />
              et cotés dans votre région
            </h1>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-1 flex items-center space-x-3">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Que cherchez-vous à accomplir ?"
                    className="flex-1 text-gray-900 placeholder-gray-500 border-none outline-none"
                  />
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className="w-24 text-gray-900 placeholder-gray-500 border-none outline-none"
                  />
                </div>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white px-6"
                  onClick={() => window.location.href = '/renovation'}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* CTA: Funnel Transformation de piece */}
            <div>
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white px-6"
                onClick={() => window.location.href = '/renovation?projectType=transformation'}
              >
                Transformation de piece
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Icons - HomeAdvisor Style */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-8 overflow-x-auto">
            {[
              { name: "Bricoleur", icon: Wrench },
              { name: "Extérieur", icon: Building },
              { name: "Aménagement", icon: Home },
              { name: "Plomberie", icon: Droplets },
              { name: "Rénovation", icon: Hammer },
              { name: "Toiture", icon: Home },
              { name: "Painting", icon: Paintbrush },
              { name: "Heating", icon: Snowflake },
              { name: "Nettoyage", icon: Sparkles },
              { name: "Béton", icon: Building },
              { name: "Transformation de piece", icon: Camera, href: '/renovation?projectType=transformation' }
            ].map((service, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => window.location.href = (service as any).href || '/renovation'}
              >
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border">
                  <service.icon className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700 text-center">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projets populaires près chez vous - HomeAdvisor Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Projets populaires près chez vous</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                name: "Rénovation Salle Bain",
                rating: "4.6",
                reviews: "5.8k+",
                price: "à partir de 8 500$",
                popular: true
              },
              {
                name: "Installation Thermopompe",
                rating: "4.2",
                reviews: "4.1k+",
                price: "à partir de 4 500$",
                popular: false
              },
              {
                name: "Rénovation Cuisine",
                rating: "4.6",
                reviews: "8.5k+",
                price: "à partir de 15 000$",
                popular: false
              },
              {
                name: "Rénovation Cuisine",
                rating: "4.3",
                reviews: "6.8k+",
                price: "à partir de 12 500$",
                popular: false
              },
              {
                name: "Rénover Clearing Serice",
                rating: "4.7",
                reviews: "16.4k+",
                price: "Devis sur mesure",
                badge: "Devis sur mesure"
              }
            ].map((project, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = '/renovation'}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      {project.popular && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Populaire</Badge>
                      )}
                      {project.badge && (
                        <Badge className="bg-green-600 text-white text-xs">{project.badge}</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-semibold text-sm">{project.rating}</span>
                      </div>
                      <span className="text-gray-500 text-sm">({project.reviews})</span>
                    </div>
                    
                    <p className="text-blue-600 font-semibold">{project.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Deuxième rangée */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
            {[
              {
                name: "Rénovation Salle de Bains",
                rating: "4.2",
                reviews: "3.2k+",
                badge: "Devis sur mesure"
              },
              {
                name: "Services Plomberie",
                rating: "4.6",
                reviews: "14.5k+",
                badge: "Devis sur mesure"
              },
              {
                name: "Travaux Électriques",
                rating: "4.8",
                reviews: "4.9k+",
                badge: "Devis sur mesure"
              },
              {
                name: "Travaux Électriques",
                rating: "4.7",
                reviews: "3.1k+",
                badge: "Devis sur mesure"
              },
              {
                name: "Isolation & Ventilation",
                rating: "4.8",
                reviews: "3.1k+",
                badge: "Devis sur mesure"
              }
            ].map((project, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = '/renovation'}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <Badge className="bg-green-600 text-white text-xs">{project.badge}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-semibold text-sm">{project.rating}</span>
                      </div>
                      <span className="text-gray-500 text-sm">({project.reviews})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Prêt à commencer votre projet ?
            </h2>
            <p className="text-xl opacity-90">
              Obtenez des devis gratuits de professionnels certifiés dans votre région.
            </p>
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
              onClick={() => window.location.href = '/renovation'}
            >
              Commencer Mon Projet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Home className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">estimation-rénovation.ai</span>
              </div>
              <p className="text-gray-400">
                Trouvez des professionnels certifiés pour tous vos projets de rénovation au Québec.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Rénovation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Plomberie</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Électricité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Thermopompe</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À Propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Estimation-Rénovation.ai. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
