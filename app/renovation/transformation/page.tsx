'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Home, ArrowRight, ArrowLeft, Upload, Palette, Calculator, Send } from 'lucide-react'

// This page is intentionally dynamic and client-only
export const dynamic = 'force-dynamic'

import { 
  ClientInfoForm,
  PhotoUploadForm,
  InspirationGallery,
  ResultsDisplay,
  RoomSelectionForm
} from '@/components/renovation'
import { PropertyTypeStep } from '@/components/renovation/property-type-step'

export default function TransformationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<{
    client: any,
    house: any,
    rooms: any[],
    roomDimensions?: Record<string, {width: string, length: string, height: string}>,
    photos: any[],
    selectedStyle?: string | null,
    inspiration?: any,
    aiResults?: any,
    costEstimation?: any
  }>({
    client: {},
    house: {},
    rooms: [],
    roomDimensions: {},
    photos: [],
    selectedStyle: null,
    inspiration: null,
    aiResults: null,
    costEstimation: null
  })

  const steps = [
    { id: 1, title: 'Informations de base', icon: Home, component: ClientInfoForm },
    { id: 2, title: 'Type de propriété', icon: Home, component: PropertyTypeStep },
    { id: 3, title: 'Pièce et dimensions', icon: Home, component: RoomSelectionForm },
    { id: 4, title: 'Photos de la pièce', icon: Upload, component: PhotoUploadForm },
    { id: 5, title: "Inspirations d'ambiances", icon: Palette, component: InspirationGallery },
    { id: 6, title: 'Résultats & estimation', icon: Calculator, component: ResultsDisplay },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep((s) => s + 1)
  }
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }
  const updateFormData = (stepData: any) => setFormData((prev) => ({ ...prev, ...stepData }))

  const CurrentStep = steps[currentStep - 1].component as any

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Transformation de piece</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => (window.location.href = '/')}>Accueil</Button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    currentStep === step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : currentStep > step.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-all ${currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
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

      {/* Form container */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-center text-2xl">{steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <CurrentStep data={formData} onUpdate={updateFormData} onNext={handleNext} />
              </CardContent>
            </Card>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Précédent</span>
              </Button>

              {currentStep < steps.length && (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2">
                  <span>Suivant</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              {currentStep === steps.length && (
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Envoyer le Projet</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
