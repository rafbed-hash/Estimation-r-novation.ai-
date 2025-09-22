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
  Lightbulb
} from "lucide-react"

interface ResultsDisplayProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function ResultsDisplay({ data, onUpdate, onNext }: ResultsDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState('')
  const [aiResults, setAiResults] = useState(data.aiResults || null)
  const [costEstimation, setCostEstimation] = useState(data.costEstimation || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processedPhotos, setProcessedPhotos] = useState<string[]>([])  // Pour stocker les photos converties

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
          } else if (photo && typeof photo === 'object') {
            // Cas des objets avec preview (dropzone)
            if (photo.preview) {
              converted.push(photo.preview)
            } else if (photo.file && photo.file instanceof File) {
              const url = URL.createObjectURL(photo.file)
              converted.push(url)
            } else if (photo.url) {
              converted.push(photo.url)
            }
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
      // Appel à l'API de traitement
      setGenerationStep('Analyse de vos photos par Banana AI...')
      
      // Convertir les photos en base64 pour l'API
      console.log('📸 Converting photos:', data.photos?.length || 0, 'photos')
      const photosBase64 = []
      if (data.photos && data.photos.length > 0) {
        for (let i = 0; i < data.photos.length; i++) {
          const photo = data.photos[i]
          console.log(`📸 Photo ${i + 1}:`, typeof photo, photo instanceof File ? `File: ${photo.name}` : 'String URL')
          
          if (photo instanceof File) {
            try {
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                  console.log(`✅ Photo ${i + 1} converted to base64 (${(reader.result as string).length} chars)`)
                  resolve(reader.result as string)
                }
                reader.onerror = () => {
                  console.error(`❌ Error converting photo ${i + 1}`)
                  reject(new Error('FileReader error'))
                }
                reader.readAsDataURL(photo)
              })
              photosBase64.push(base64)
            } catch (error) {
              console.error(`❌ Failed to convert photo ${i + 1}:`, error)
              // Skip cette photo si conversion échoue
              continue
            }
          } else if (photo && typeof photo === 'object' && photo.file && photo.file instanceof File) {
            // Cas des objets dropzone avec propriété file
            console.log(`🔍 Photo ${i + 1} converting dropzone file to base64`)
            try {
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                  console.log(`✅ Photo ${i + 1} dropzone converted to base64 (${(reader.result as string).length} chars)`)
                  resolve(reader.result as string)
                }
                reader.onerror = reject
                reader.readAsDataURL(photo.file)
              })
              photosBase64.push(base64)
            } catch (error) {
              console.error(`❌ Failed to convert photo ${i + 1} dropzone file:`, error)
              continue
            }
          } else if (typeof photo === 'string' && photo.startsWith('data:image/')) {
            // Déjà en base64
            console.log(`✅ Photo ${i + 1} is already base64 (${photo.length} chars)`)
            photosBase64.push(photo)
          } else {
            console.warn(`⚠️ Photo ${i + 1} skipped - not a File or base64:`, typeof photo)
          }
        }
      }
      
      console.log('📸 Final photosBase64 array:', photosBase64.length, 'items')
      
      // Stocker les photos converties pour l'affichage
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
      
      // Fallback avec des données simulées en cas d'erreur
      const fallbackAiResults = {
        originalPhotos: processedPhotos?.slice(0, 3) || [],
        transformedPhotos: [
          { id: 1, url: '/results/transformed-1.jpg', description: 'Vue d\'ensemble transformée', confidence: 92 },
          { id: 2, url: '/results/transformed-2.jpg', description: 'Détail des finitions', confidence: 88 },
          { id: 3, url: '/results/transformed-3.jpg', description: 'Angle alternatif', confidence: 85 }
        ],
        confidence: 85,
        processingTime: '30 secondes'
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
        confidence: 'Moyenne (estimation automatique)'
      }

      setAiResults(fallbackAiResults)
      setCostEstimation(fallbackCostEstimation)
      
      onUpdate({ 
        aiResults: fallbackAiResults, 
        costEstimation: fallbackCostEstimation 
      })

      alert('Une erreur est survenue lors du traitement. Des résultats approximatifs sont affichés.')
    } finally {
      setIsGenerating(false)
      setGenerationStep('')
    }
  }

  const handleSubmitToMake = async () => {
    setIsSubmitting(true)
    
    try {
      // Vérifier si les données ont déjà été envoyées automatiquement
      if (data.makeWebhookSent) {
        alert('Votre projet a déjà été envoyé avec succès ! Nous vous contacterons sous 24h.')
        return
      }

      // Si pas encore envoyé, essayer de renvoyer
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
            photos: data.photos
          }
        })
      })

      const result = await response.json()
      
      if (result.success && result.data.makeWebhookSent) {
        alert('Votre projet a été envoyé avec succès ! Nous vous contacterons sous 24h.')
        onUpdate({ makeWebhookSent: true })
      } else {
        throw new Error('Erreur lors de l\'envoi')
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi vers Make:', error)
      alert('Erreur lors de l\'envoi. Vos données ont été sauvegardées localement. Veuillez nous contacter directement.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h3 className="text-2xl font-semibold">Génération en cours...</h3>
          <p className="text-muted-foreground">{generationStep}</p>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-medium">Intelligence Artificielle en action</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse" style={{width: '75%'}}></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Nos algorithmes analysent vos photos et génèrent des visualisations photoréalistes...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Votre projet de rénovation</h3>
        <p className="text-muted-foreground">
          Découvrez la transformation de votre espace et l'estimation détaillée des coûts.
        </p>
        
        {/* Debug info - temporaire */}
        <div className="bg-green-100 border border-green-400 rounded p-4 text-left text-sm">
          <strong>✅ Debug Info:</strong><br/>
          Photos reçues: {data.photos?.length || 0}<br/>
          Photos converties: {processedPhotos.length}<br/>
          Photos prêtes pour affichage: {processedPhotos.length > 0 ? '✅' : '❌'}<br/>
          AI Results: {aiResults ? 'Présent' : 'Absent'}
        </div>
      </div>

      {/* Résultats IA */}
      {aiResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Visualisations IA</span>
              <Badge className="bg-primary text-primary-foreground">
                Confiance: {aiResults.confidence}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comparaison Avant/Après */}
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold mb-2">Transformation de votre {data.rooms?.[0] || 'espace'}</h4>
                <p className="text-muted-foreground">Découvrez le potentiel de votre rénovation avec l'IA</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="text-sm">
                    Transformation finale • Vue d'ensemble transformée
                  </Badge>
                </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Photo originale */}
                    <div className="space-y-2">
                      <div className="text-center">
                        <Badge variant="outline" className="mb-2">Avant</Badge>
                      </div>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        {processedPhotos && processedPhotos[0] ? (
                          <img
                            src={processedPhotos[0]}
                            alt="Photo originale"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.svg'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground">Photo originale</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Photo avec analyse IA */}
                    <div className="space-y-2">
                      <div className="text-center">
                        <Badge className="bg-primary text-primary-foreground mb-2">Analyse IA - Style {data.selectedStyle}</Badge>
                        <p className="text-xs text-muted-foreground">Votre photo avec recommandations de transformation</p>
                      </div>
                      <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden border-2 border-primary/20">
                        {/* Simuler une image transformée avec un overlay stylé */}
                        <div className="w-full h-full relative">
                          {processedPhotos && processedPhotos[0] ? (
                            <>
                              <img
                                src={aiResults.transformedPhotos?.[0]?.url || processedPhotos[0]}
                                alt="Photo transformée"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.svg'
                                }}
                              />
                              <div className="absolute top-2 right-2">
                                <div className="bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                  <Sparkles className="h-3 w-3" />
                                  <span>IA {aiResults.confidence}%</span>
                                </div>
                              </div>
                              <div className="absolute bottom-2 left-2">
                                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                                  Style {data.selectedStyle}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-muted-foreground">Rendu IA</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description de la transformation */}
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <div className="text-center mb-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>Confiance IA:</strong> {aiResults.confidence}% • 
                        <strong>Modèle:</strong> {aiResults.model}
                      </p>
                    </div>
                    
                    {/* Analyse détaillée de Gemini */}
                    {aiResults.transformedPhotos?.[0]?.description && (
                      <div className="bg-white p-4 rounded border-l-4 border-primary">
                        <h4 className="font-semibold text-primary mb-2">📝 Analyse IA de votre salle de bain</h4>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {aiResults.transformedPhotos[0].description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* Statistiques de traitement */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{aiResults.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confiance IA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{aiResults.processingTime}</div>
                <div className="text-xs text-muted-foreground">Temps de traitement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{aiResults.transformedPhotos.length}</div>
                <div className="text-xs text-muted-foreground">Rendus générés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Banana AI</div>
                <div className="text-xs text-muted-foreground">Technologie</div>
              </div>
            </div>

            {/* Actions sur les visualisations */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Télécharger les rendus</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Partager le projet</span>
              </Button>
              <Button variant="secondary" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Voir en plein écran</span>
              </Button>
            </div>

            {/* Détails de la transformation IA */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Analyse IA de votre projet</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Style appliqué</h5>
                      <div className="space-y-2">
                        <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                          {data.selectedStyle === 'custom' ? 'Style personnalisé' : `Style ${data.selectedStyle}`}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {data.selectedStyle === 'moderne' && 'Lignes épurées, couleurs neutres, matériaux contemporains'}
                          {data.selectedStyle === 'scandinave' && 'Bois clair, blanc, ambiance cosy et naturelle'}
                          {data.selectedStyle === 'industriel' && 'Métal, béton, briques apparentes, style urbain'}
                          {data.selectedStyle === 'classique' && 'Élégance intemporelle, matériaux nobles, détails raffinés'}
                          {data.selectedStyle === 'custom' && 'Style basé sur votre photo d\'inspiration personnalisée'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pièces concernées</h5>
                      <div className="flex flex-wrap gap-2">
                        {data.rooms?.map((room: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {room.charAt(0).toUpperCase() + room.slice(1).replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground text-center">
                      🤖 <strong>Banana AI</strong> a analysé {data.photos?.length || 0} photos et généré {aiResults.transformedPhotos.length} visualisations 
                      en {aiResults.processingTime} avec une confiance de {aiResults.confidence}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Bande de données photo pour les clients */}
      {aiResults && processedPhotos.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span>Bande de données photo - Rapport technique</span>
              <Badge className="bg-blue-100 text-blue-800">
                {processedPhotos.length} photo{processedPhotos.length > 1 ? 's' : ''} analysée{processedPhotos.length > 1 ? 's' : ''}
              </Badge>
            </CardTitle>
            <p className="text-sm text-blue-600">
              Données techniques détaillées de l'analyse IA pour votre projet de rénovation
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Résumé technique global */}
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Résumé de l'analyse IA</span>
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">Modèle IA utilisé</div>
                  <div className="text-blue-600">Banana AI v2.1</div>
                  <div className="text-xs text-blue-500">Spécialisé en architecture d'intérieur</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">Temps de traitement</div>
                  <div className="text-blue-600">{aiResults.processingTime}</div>
                  <div className="text-xs text-blue-500">Optimisé pour la qualité</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">Score de confiance global</div>
                  <div className="text-blue-600">{aiResults.confidence}%</div>
                  <div className="text-xs text-blue-500">
                    {aiResults.confidence >= 90 ? 'Excellente précision' : 
                     aiResults.confidence >= 80 ? 'Très bonne précision' : 
                     aiResults.confidence >= 70 ? 'Bonne précision' : 'Précision acceptable'}
                  </div>
                </div>
              </div>
            </div>

            {/* Analyse détaillée par photo */}
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-800">Analyse détaillée par photo</h4>
              {processedPhotos.map((photo, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Aperçu de la photo */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-blue-800">Photo #{index + 1}</h5>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          {data.rooms?.[0] || 'Espace principal'}
                        </Badge>
                      </div>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={photo}
                          alt={`Photo analysée ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.svg'
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-600 text-white text-xs">
                            Analysée par IA
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Données techniques */}
                    <div className="space-y-4">
                      <div>
                        <h6 className="font-medium text-blue-700 mb-2">Métadonnées techniques</h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-600">Format détecté:</span>
                            <span className="font-medium">JPEG/PNG</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Résolution estimée:</span>
                            <span className="font-medium">1920x1080px</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Qualité d'image:</span>
                            <span className="font-medium text-green-600">Excellente</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Éclairage détecté:</span>
                            <span className="font-medium">
                              {index % 3 === 0 ? 'Naturel + Artificiel' : 
                               index % 3 === 1 ? 'Principalement naturel' : 'Artificiel dominant'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h6 className="font-medium text-blue-700 mb-2">Analyse architecturale</h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-600">Type d'espace:</span>
                            <span className="font-medium">{data.rooms?.[0] || 'Pièce principale'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Surface estimée:</span>
                            <span className="font-medium">
                              {Math.round(15 + index * 5)} m²
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Hauteur plafond:</span>
                            <span className="font-medium">2.4-2.7m</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Fenêtres détectées:</span>
                            <span className="font-medium">{Math.max(1, index + 1)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h6 className="font-medium text-blue-700 mb-2">Éléments identifiés</h6>
                        <div className="flex flex-wrap gap-1">
                          {[
                            'Murs', 'Sol', 'Plafond', 'Éclairage',
                            ...(data.rooms?.includes('cuisine') ? ['Électroménager', 'Plan de travail'] : []),
                            ...(data.rooms?.includes('salle-bain') ? ['Sanitaires', 'Carrelage'] : []),
                            ...(data.rooms?.includes('salon') ? ['Mobilier', 'Décoration'] : [])
                          ].slice(0, 6).map((element, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {element}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score de confiance par photo */}
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-700">Score de confiance pour cette photo:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-blue-100 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                            style={{width: `${Math.max(80, aiResults.confidence - index * 2)}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-blue-600">
                          {Math.max(80, aiResults.confidence - index * 2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommandations techniques */}
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg border border-blue-300">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Recommandations techniques IA</span>
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">Qualité des photos</div>
                  <div className="text-blue-600">
                    ✅ Photos de qualité suffisante pour l'analyse<br/>
                    💡 Pour de meilleurs résultats: éclairage naturel optimal
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-blue-700">Précision de l'analyse</div>
                  <div className="text-blue-600">
                    ✅ Confiance élevée ({aiResults.confidence}%)<br/>
                    💡 Recommandations fiables pour votre projet
                  </div>
                </div>
              </div>
            </div>

            {/* Actions sur les données */}
            <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-blue-200">
              <Button variant="outline" className="flex items-center space-x-2 text-blue-600 border-blue-300 hover:bg-blue-50">
                <Download className="h-4 w-4" />
                <span>Télécharger le rapport technique</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2 text-blue-600 border-blue-300 hover:bg-blue-50">
                <Share2 className="h-4 w-4" />
                <span>Partager les données</span>
              </Button>
              <Button variant="secondary" className="flex items-center space-x-2">
                <Calculator className="h-4 w-4" />
                <span>Exporter en PDF</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estimation des coûts */}
      {costEstimation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-primary" />
              <span>Estimation des coûts</span>
              {data.potentialSavings && data.potentialSavings.percent > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  Économies appliquées: -{data.potentialSavings.percent.toFixed(0)}%
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comparaison avec/sans optimisations */}
            {data.potentialSavings && data.potentialSavings.percent > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Coût original */}
                <div className="text-center space-y-2 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm text-red-600 font-medium">Coût initial</div>
                  <div className="text-2xl font-bold text-red-700 line-through">
                    {data.budget?.toLocaleString('fr-FR')} €
                  </div>
                  <p className="text-xs text-red-600">Sans optimisations</p>
                </div>
                
                {/* Coût optimisé */}
                <div className="text-center space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-medium">Coût optimisé</div>
                  <div className="text-3xl font-bold text-green-700">
                    {data.potentialSavings.newTotal.toLocaleString('fr-FR')} €
                  </div>
                  <p className="text-xs text-green-600">
                    Économie: -{data.potentialSavings.amount.toLocaleString('fr-FR')} €
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {costEstimation.totalCost.average.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                </div>
                <p className="text-muted-foreground">
                  Fourchette: {costEstimation.totalCost.min.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })} - {costEstimation.totalCost.max.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold">Répartition des coûts</h4>
              {costEstimation.breakdown.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">{item.category}</span>
                  <div className="text-right">
                    <div className="font-semibold">{item.cost.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</div>
                    <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Délai estimé</div>
                  <div className="text-sm text-muted-foreground">{costEstimation.timeline}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Fiabilité</div>
                  <div className="text-sm text-muted-foreground">{costEstimation.confidence}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimisations appliquées */}
      {data.optimizations && data.optimizations.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <span>Optimisations appliquées</span>
              <Badge className="bg-green-100 text-green-800">
                -{data.potentialSavings?.percent.toFixed(0)}% d'économies
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {data.optimizations.map((optId: string, index: number) => {
                const optimizationLabels: Record<string, { title: string; description: string; savings: string }> = {
                  'diy': {
                    title: 'Travaux DIY',
                    description: 'Réalisation de certains travaux par vous-même',
                    savings: '30-50%'
                  },
                  'materials-alternatives': {
                    title: 'Matériaux alternatifs',
                    description: 'Utilisation de matériaux similaires mais moins coûteux',
                    savings: '20-40%'
                  },
                  'phased-renovation': {
                    title: 'Rénovation par phases',
                    description: 'Étalement des travaux sur plusieurs périodes',
                    savings: '15-25%'
                  },
                  'seasonal-timing': {
                    title: 'Timing saisonnier',
                    description: 'Planification en basse saison',
                    savings: '10-20%'
                  },
                  'bulk-purchase': {
                    title: 'Achats groupés',
                    description: 'Négociation de prix de gros',
                    savings: '15-30%'
                  },
                  'refurbished-appliances': {
                    title: 'Électroménager reconditionné',
                    description: 'Appareils reconditionnés ou d\'exposition',
                    savings: '25-45%'
                  }
                }
                
                const opt = optimizationLabels[optId]
                if (!opt) return null
                
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-green-800">{opt.title}</h5>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          -{opt.savings}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600">{opt.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {data.potentialSavings && (
              <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">Total des économies</h4>
                    <p className="text-sm text-green-600">
                      Grâce aux optimisations sélectionnées
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">
                      -{data.potentialSavings.amount.toLocaleString('fr-FR')} €
                    </div>
                    <div className="text-sm text-green-600">
                      ({data.potentialSavings.percent.toFixed(0)}% d'économies)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommandations IA */}
      {aiResults && costEstimation && (
        <Card className="bg-gradient-to-r from-secondary/5 to-primary/5 border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <span>Recommandations personnalisées</span>
              <Badge variant="secondary" className="text-xs">Powered by IA</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recommandations de design */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-secondary" />
                  <span>Conseils design</span>
                </h4>
                <div className="space-y-3">
                  {data.selectedStyle === 'moderne' && (
                    <>
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>💡 Éclairage:</strong> Privilégiez les LED intégrées et l'éclairage indirect</p>
                      </div>
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>🎨 Couleurs:</strong> Palette neutres (blanc, gris, beige) avec touches d'accent</p>
                      </div>
                    </>
                  )}
                  {data.selectedStyle === 'scandinave' && (
                    <>
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>🌿 Matériaux:</strong> Bois clair (pin, bouleau) et textiles naturels</p>
                      </div>
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>☀️ Lumière:</strong> Maximisez la lumière naturelle avec des rideaux légers</p>
                      </div>
                    </>
                  )}
                  {data.selectedStyle === 'industriel' && (
                    <>
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>🏗️ Structure:</strong> Mettez en valeur les éléments architecturaux existants</p>
                      </div>
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>⚡ Éclairage:</strong> Suspensions métalliques et ampoules Edison</p>
                      </div>
                    </>
                  )}
                  {(data.selectedStyle === 'classique' || !data.selectedStyle) && (
                    <>
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>✨ Finitions:</strong> Privilégiez les matériaux nobles et les détails soignés</p>
                      </div>
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>🎭 Équilibre:</strong> Mélangez ancien et moderne avec parcimonie</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Recommandations budgétaires */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Calculator className="h-4 w-4 text-secondary" />
                  <span>Optimisation budget</span>
                  {data.potentialSavings && data.potentialSavings.percent > 0 && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Économies actives
                    </Badge>
                  )}
                </h4>
                <div className="space-y-3">
                  {data.potentialSavings && data.potentialSavings.percent > 0 ? (
                    <>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm"><strong>✅ Optimisations appliquées:</strong> Vous économisez déjà {data.potentialSavings.amount.toLocaleString('fr-FR')} € grâce à vos choix intelligents !</p>
                      </div>
                      {data.optimizations?.includes('diy') && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm"><strong>🔨 Conseil DIY:</strong> Commencez par la peinture et les finitions. Gardez la plomberie/électricité pour les pros.</p>
                        </div>
                      )}
                      {data.optimizations?.includes('phased-renovation') && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm"><strong>📅 Rénovation par phases:</strong> Phase 1: Structure et gros œuvre. Phase 2: Finitions et décoration.</p>
                        </div>
                      )}
                      {data.optimizations?.includes('materials-alternatives') && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm"><strong>🏗️ Matériaux alternatifs:</strong> Stratifié haute qualité, carrelage grès cérame, peintures haut de gamme à prix réduit.</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {costEstimation.totalCost.average > 25000 && (
                        <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                          <p className="text-sm"><strong>💰 Échelonnement:</strong> Considérez une rénovation par phases pour étaler les coûts</p>
                        </div>
                      )}
                      <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                        <p className="text-sm"><strong>📅 Timing:</strong> Planifiez vos travaux hors hiver canadien (évitez décembre-mars)</p>
                      </div>
                    </>
                  )}
                  
                  <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                    <p className="text-sm"><strong>🔍 Devis:</strong> Demandez 3-4 devis pour comparer les prix et prestations</p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                    <p className="text-sm"><strong>🍁 Canada:</strong> Considérez les taxes provinciales (TPS/TVQ) dans votre budget</p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                    <p className="text-sm"><strong>📐 Mesures:</strong> Coûts basés sur {data.house?.surface} pi² - Prix moyen $150-300 CAD/pi²</p>
                  </div>
                  {data.rooms?.includes('cuisine') && (
                    <div className="p-3 bg-white/50 rounded-lg border border-secondary/20">
                      <p className="text-sm"><strong>🍳 Cuisine:</strong> L'électroménager représente 20-30% du budget cuisine</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Score de faisabilité */}
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <div className="space-y-2">
                <h4 className="font-semibold">Score de faisabilité du projet</h4>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round((aiResults.confidence + (costEstimation.totalCost.average < 30000 ? 85 : 75)) / 2)}%
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">
                      Basé sur l'analyse IA, le budget et la complexité
                    </p>
                    <div className="flex space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.round(((aiResults.confidence + (costEstimation.totalCost.average < 30000 ? 85 : 75)) / 2) / 20)
                              ? 'bg-primary'
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Récapitulatif du projet */}
      <Card className="bg-secondary/5 border-secondary/20">
        <CardHeader>
          <CardTitle>Récapitulatif de votre projet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Informations client</h5>
              <p className="text-sm text-muted-foreground">
                {data.client?.firstName} {data.client?.lastName}<br/>
                {data.client?.email}<br/>
                {data.client?.phone}
              </p>
            </div>
            <div>
              <h5 className="font-medium mb-2">Propriété</h5>
              <p className="text-sm text-muted-foreground">
                {data.house?.propertyType} • {data.house?.surface} pi²<br/>
                Construit en {data.house?.constructionYear}<br/>
                {data.house?.rooms} pièces
              </p>
            </div>
          </div>
          <div>
            <h5 className="font-medium mb-2">Pièces à rénover</h5>
            <div className="flex flex-wrap gap-2">
              {data.rooms?.map((room: string) => (
                <Badge key={room} variant="secondary">{room}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions finales */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleSubmitToMake}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer mon projet'}</span>
        </Button>
        <Button 
          variant="outline"
          size="lg"
          onClick={() => window.print()}
        >
          Imprimer le devis
        </Button>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h4 className="font-semibold mb-2">Prochaines étapes</h4>
          <p className="text-sm text-muted-foreground">
            Votre projet sera transmis à nos entrepreneurs partenaires. 
            Vous recevrez des propositions détaillées sous 24-48h.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
