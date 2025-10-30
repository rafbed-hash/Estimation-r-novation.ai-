'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Download, 
  Share2, 
  Calculator, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Send,
  Palette,
  TrendingDown,
  DollarSign,
  Lightbulb,
  Home,
  ArrowRight
} from "lucide-react"

interface ResultsDisplayProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function ResultsDisplayImproved({ data, onUpdate, onNext }: ResultsDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState('')
  const [aiResults, setAiResults] = useState(data.aiResults || null)
  const [costEstimation, setCostEstimation] = useState(data.costEstimation || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processedPhotos, setProcessedPhotos] = useState<string[]>([])

  useEffect(() => {
    // Conversion immédiate des photos pour l'affichage
    if (data.photos && data.photos.length > 0) {
      const convertPhotos = async () => {
        const converted = []
        for (const photo of data.photos) {
          if (photo instanceof File) {
            const url = URL.createObjectURL(photo)
            converted.push(url)
          } else if (typeof photo === 'string') {
            converted.push(photo)
          }
        }
        setProcessedPhotos(converted)
      }
      convertPhotos()
    }
    
    if (!aiResults || !costEstimation) {
      generateResults()
    }
  }, [])

  const generateResults = async () => {
    setIsGenerating(true)
    
    try {
      setGenerationStep('Analyse de vos photos par IA...')
      
      const photosBase64 = []
      if (data.photos && data.photos.length > 0) {
        for (let i = 0; i < data.photos.length; i++) {
          const photo = data.photos[i]
          if (typeof photo === 'string' && photo.startsWith('data:image/')) {
            photosBase64.push(photo)
          }
        }
      }
      
      setProcessedPhotos(photosBase64)
      
      const response = await fetch('/api/renovation/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: data.client,
          house: data.house,
          project: {
            selectedRooms: data.rooms,
            selectedStyle: data.selectedStyle,
            useCustomPhoto: data.useCustomPhoto,
            photos: photosBase64,
            customPrompt: data.customPrompt
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`)
      }

      setGenerationStep('Traitement en cours...')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors du traitement')
      }

      setGenerationStep('Finalisation...')
      
      setAiResults(result.data.aiResults)
      setCostEstimation(result.data.costEstimation)
      
      onUpdate({ 
        aiResults: result.data.aiResults, 
        costEstimation: result.data.costEstimation,
        makeWebhookSent: result.data.makeWebhookSent
      })

    } catch (error) {
      console.error('Erreur lors de la génération:', error)
      
      // Fallback avec des données simulées
      const fallbackAiResults = {
        originalPhotos: processedPhotos?.slice(0, 3) || [],
        transformedPhotos: [
          { 
            id: 1, 
            url: processedPhotos?.[0] || '/placeholder-image.svg', 
            description: `Transformation ${data.selectedStyle} simulée - Configuration API requise pour l'analyse complète.`, 
            confidence: 75 
          }
        ],
        confidence: 75,
        processingTime: '2 secondes',
        model: 'simulation-mode'
      }

      const fallbackCostEstimation = {
        totalCost: {
          min: 15000,
          max: 25000,
          average: 20000
        },
        breakdown: [
          { category: 'Matériaux', cost: 8000, percentage: 40 },
          { category: 'Main-d\'œuvre', cost: 9000, percentage: 45 },
          { category: 'Design et planification', cost: 2000, percentage: 10 },
          { category: 'Imprévus (5%)', cost: 1000, percentage: 5 }
        ],
        timeline: '4-6 semaines',
        confidence: 'Estimation automatique (configuration API requise pour plus de précision)'
      }

      setAiResults(fallbackAiResults)
      setCostEstimation(fallbackCostEstimation)
      
      onUpdate({ 
        aiResults: fallbackAiResults, 
        costEstimation: fallbackCostEstimation 
      })

    } finally {
      setIsGenerating(false)
      setGenerationStep('')
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Génération en cours...</h3>
              <p className="text-muted-foreground">{generationStep}</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse" style={{width: '75%'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec résumé */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold">
              Votre projet de rénovation est prêt !
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez la transformation de votre {data.rooms?.[0] || 'espace'} en style {data.selectedStyle}
            </p>
            
            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{data.photos?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Photos analysées</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{aiResults?.confidence || 75}%</div>
                <div className="text-sm text-muted-foreground">Confiance IA</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{costEstimation?.totalCost?.average?.toLocaleString() || '20 000'}€</div>
                <div className="text-sm text-muted-foreground">Coût estimé</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{costEstimation?.timeline || '4-6'}</div>
                <div className="text-sm text-muted-foreground">Semaines</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Section Visualisation IA */}
        {aiResults && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span>Visualisation IA de votre transformation</span>
              </h2>
              <p className="text-muted-foreground">
                Notre IA a analysé vos photos et généré une visualisation de votre projet
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Photo originale */}
                  <div className="relative">
                    <div className="aspect-video bg-muted">
                      {processedPhotos && processedPhotos[0] ? (
                        <img
                          src={processedPhotos[0]}
                          alt="Photo originale"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">Photo originale</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary">Avant</Badge>
                    </div>
                  </div>

                  {/* Photo transformée */}
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10">
                      {aiResults.transformedPhotos?.[0]?.url ? (
                        <img
                          src={aiResults.transformedPhotos[0].url}
                          alt="Photo transformée"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <Sparkles className="h-12 w-12 text-primary mx-auto" />
                            <p className="text-sm text-muted-foreground">Visualisation IA</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        Après - Style {data.selectedStyle}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90">
                        IA {aiResults.confidence}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description de l'analyse */}
                {aiResults.transformedPhotos?.[0]?.description && (
                  <div className="p-6 bg-muted/30">
                    <h4 className="font-semibold text-primary mb-2 flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>Analyse IA de votre projet</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {aiResults.transformedPhotos[0].description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Section Estimation des coûts */}
        {costEstimation && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
                <Calculator className="h-6 w-6 text-primary" />
                <span>Estimation détaillée des coûts</span>
              </h2>
              <p className="text-muted-foreground">
                Répartition budgétaire pour votre projet de rénovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Coût total */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {costEstimation.totalCost.average.toLocaleString()}€
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimation moyenne
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Minimum:</span>
                      <span className="font-medium">{costEstimation.totalCost.min.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maximum:</span>
                      <span className="font-medium">{costEstimation.totalCost.max.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Délai:</span>
                      <span>{costEstimation.timeline}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Répartition des coûts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Répartition budgétaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {costEstimation.breakdown.map((item: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span className="font-medium">{item.cost.toLocaleString()}€</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{width: `${item.percentage}%`}}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {item.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Actions finales */}
        <section className="text-center space-y-6">
          <div className="bg-primary/5 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Prêt à concrétiser votre projet ?</h3>
            <p className="text-muted-foreground mb-6">
              Nos experts peuvent vous accompagner dans la réalisation de votre rénovation
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => {/* Logique d'envoi */}}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer mon projet
              </Button>
              
              <Button variant="outline" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Télécharger le rapport
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="h-4 w-4 mr-2" />
                Partager le projet
              </Button>
            </div>
          </div>

          {/* Informations de contact */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <Home className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Besoin d'aide ?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Nos conseillers sont disponibles pour vous accompagner
              </p>
              <Button variant="outline" className="w-full">
                Contacter un expert
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
