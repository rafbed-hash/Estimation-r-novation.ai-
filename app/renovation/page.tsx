'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, ArrowRight, ArrowLeft, Upload, Palette, Calculator, Send, TrendingDown } from "lucide-react"
import { 
  ClientInfoForm,
  HouseInfoForm,
  RoomSelectionForm,
  PhotoUploadForm,
  StyleSelectionForm,
  CostOptimizationForm,
  ResultsDisplay
} from "../../components/renovation"

export default function RenovationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    client: {},
    house: {},
    rooms: [],
    photos: [],
    selectedStyle: null,
    aiResults: null,
    costEstimation: null
  })

  const steps = [
    { id: 1, title: "Informations Client", icon: Home, component: ClientInfoForm },
    { id: 2, title: "Informations Maison", icon: Home, component: HouseInfoForm },
    { id: 3, title: "Sélection des Pièces", icon: Home, component: RoomSelectionForm },
    { id: 4, title: "Photos de la Pièce", icon: Upload, component: PhotoUploadForm },
    { id: 5, title: "Choix du Style", icon: Palette, component: StyleSelectionForm },
    { id: 6, title: "Optimisation des Coûts", icon: TrendingDown, component: CostOptimizationForm },
    { id: 7, title: "Résultats", icon: Calculator, component: ResultsDisplay }
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  const CurrentStepComponent = steps[currentStep - 1].component

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
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Accueil
            </a>
            <a href="#" className="text-primary font-semibold">
              Rénovation IA
            </a>
          </nav>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-primary text-primary-foreground border-primary">
              ✨ Rénovation avec Intelligence Artificielle
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
              Visualisez votre <span className="text-primary">rénovation de rêve</span> en temps réel
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Notre IA transforme vos photos en visualisations 3D réalistes et calcule automatiquement le coût de votre projet de rénovation.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep === step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : currentStep > step.id 
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-all ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold">{steps[currentStep - 1].title}</h2>
            <p className="text-muted-foreground">Étape {currentStep} sur {steps.length}</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  {steps[currentStep - 1].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <CurrentStepComponent 
                  data={formData}
                  onUpdate={updateFormData}
                  onNext={handleNext}
                />
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Précédent</span>
              </Button>
              
              {currentStep < steps.length && (
                <Button 
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              
              {currentStep === steps.length && (
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Envoyer le Projet</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Soumission Rénovation.AI</span>
            </div>
            <p className="text-muted-foreground">
              Votre partenaire de confiance pour tous vos projets de rénovation avec IA.
            </p>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Soumission Rénovation.AI. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
