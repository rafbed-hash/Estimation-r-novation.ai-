'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Sparkles, Upload, X, Loader2 } from "lucide-react"
import type { InspirationPhoto } from '@/lib/services/unsplash'

interface StyleSelectionFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function StyleSelectionForm({ data, onUpdate, onNext }: StyleSelectionFormProps) {
  const [selectedStyle, setSelectedStyle] = useState(data.selectedStyle || null)
  const [useCustomPhoto, setUseCustomPhoto] = useState(false)
  const [inspirationPhoto, setInspirationPhoto] = useState<File | null>(data.inspirationPhoto || null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [stylePhotos, setStylePhotos] = useState<Record<string, InspirationPhoto[]>>({})
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Charger les photos d'inspiration au montage du composant
  useEffect(() => {
    const loadInspirationPhotos = async () => {
      if (!data.rooms || data.rooms.length === 0) return

      setLoadingPhotos(true)
      try {
        const firstRoom = data.rooms[0]
        console.log(`🖼️ Loading inspiration photos for ${firstRoom}`)

        const response = await fetch('/api/inspiration/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ roomType: firstRoom })
        })

        if (response.ok) {
          const result = await response.json()
          setStylePhotos(result.stylePhotos)
          console.log(`✅ Loaded inspiration photos for ${firstRoom}`)
        } else {
          console.error('❌ Failed to load inspiration photos')
        }
      } catch (error) {
        console.error('❌ Error loading inspiration photos:', error)
      } finally {
        setLoadingPhotos(false)
      }
    }

    loadInspirationPhotos()
  }, [data.rooms])

  // Styles prédéfinis selon la pièce sélectionnée
  const getStylesForRoom = (room: string) => {
    const baseStyles = [
      {
        id: 'moderne',
        name: 'Moderne',
        description: 'Lignes épurées, couleurs neutres, matériaux contemporains',
        image: '/styles/moderne.jpg',
        tags: ['Minimaliste', 'Élégant', 'Fonctionnel']
      },
      {
        id: 'scandinave',
        name: 'Scandinave',
        description: 'Bois clair, blanc, ambiance cosy et naturelle',
        image: '/styles/scandinave.jpg',
        tags: ['Naturel', 'Lumineux', 'Chaleureux']
      },
      {
        id: 'industriel',
        name: 'Industriel',
        description: 'Métal, béton, briques apparentes, style urbain',
        image: '/styles/industriel.jpg',
        tags: ['Urbain', 'Authentique', 'Caractère']
      },
      {
        id: 'classique',
        name: 'Classique',
        description: 'Élégance intemporelle, matériaux nobles, détails raffinés',
        image: '/styles/classique.jpg',
        tags: ['Élégant', 'Intemporel', 'Raffiné']
      }
    ]

    // Styles spécifiques selon la pièce
    if (room === 'cuisine') {
      return [
        ...baseStyles,
        {
          id: 'campagne',
          name: 'Campagne Chic',
          description: 'Bois patiné, carrelage métro, ambiance rustique élégante',
          image: '/styles/campagne-cuisine.jpg',
          tags: ['Rustique', 'Authentique', 'Convivial']
        }
      ]
    }

    if (room === 'salle-de-bain') {
      return [
        ...baseStyles,
        {
          id: 'spa',
          name: 'Spa Zen',
          description: 'Matériaux naturels, ambiance relaxante, tons apaisants',
          image: '/styles/spa-sdb.jpg',
          tags: ['Relaxant', 'Naturel', 'Zen']
        }
      ]
    }

    return baseStyles
  }

  const selectedRoom = data.rooms?.[0] || 'salon'
  const styles = getStylesForRoom(selectedRoom)

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId)
    setUseCustomPhoto(false)
    if (errors.style) {
      setErrors(prev => ({ ...prev, style: '' }))
    }
  }

  const handleCustomPhotoSelect = () => {
    setUseCustomPhoto(true)
    setSelectedStyle(null)
    if (errors.style) {
      setErrors(prev => ({ ...prev, style: '' }))
    }
  }

  const handleInspirationPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validation du fichier
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, inspirationPhoto: 'Veuillez sélectionner une image' }))
        return
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB max
        setErrors(prev => ({ ...prev, inspirationPhoto: 'L\'image ne doit pas dépasser 10MB' }))
        return
      }

      setInspirationPhoto(file)
      setErrors(prev => ({ ...prev, inspirationPhoto: '' }))
    }
  }

  const removeInspirationPhoto = () => {
    setInspirationPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedStyle && !useCustomPhoto) {
      newErrors.style = 'Veuillez sélectionner un style ou choisir d\'utiliser votre propre photo de référence'
    }

    if (useCustomPhoto && !inspirationPhoto) {
      newErrors.inspirationPhoto = 'Veuillez ajouter une photo d\'inspiration'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate({ 
        selectedStyle: useCustomPhoto ? 'custom' : selectedStyle,
        useCustomPhoto,
        inspirationPhoto: useCustomPhoto ? inspirationPhoto : null
      })
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Palette className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Choisissez votre style de rénovation</h3>
        <p className="text-muted-foreground">
          Sélectionnez le style qui vous inspire pour votre {selectedRoom}. Notre IA utilisera cette référence 
          pour transformer vos photos en visualisation 3D réaliste.
        </p>
      </div>

      {(selectedStyle || useCustomPhoto) && (
        <div className="text-center">
          <Badge className="bg-primary text-primary-foreground">
            {useCustomPhoto ? 'Photo personnalisée sélectionnée' : `Style ${styles.find(s => s.id === selectedStyle)?.name} sélectionné`}
          </Badge>
        </div>
      )}

      {/* Styles prédéfinis avec photos d'inspiration */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-center">Styles recommandés pour votre {selectedRoom}</h4>
        
        {loadingPhotos ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Chargement des photos d'inspiration...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {styles.map((style) => {
              const photos = stylePhotos[style.id] || []
              const mainPhoto = photos[0]
              
              return (
                <Card
                  key={style.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedStyle === style.id && !useCustomPhoto
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleStyleSelect(style.id)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      {mainPhoto ? (
                        <div className="aspect-video rounded-t-lg overflow-hidden">
                          <img 
                            src={mainPhoto.url} 
                            alt={mainPhoto.alt}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <Palette className="h-12 w-12 text-muted-foreground mx-auto" />
                            <p className="text-sm text-muted-foreground">Style {style.name}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedStyle === style.id && !useCustomPhoto && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h5 className={`text-xl font-semibold mb-2 ${
                        selectedStyle === style.id && !useCustomPhoto ? 'text-primary' : 'text-foreground'
                      }`}>
                        {style.name}
                      </h5>
                      <p className="text-muted-foreground mb-4">{style.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {style.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Galerie de photos miniatures */}
                      {photos.length > 1 && (
                        <div className="flex gap-2 mt-3">
                          {photos.slice(1, 4).map((photo, index) => (
                            <div key={photo.id} className="w-12 h-12 rounded overflow-hidden">
                              <img 
                                src={photo.url} 
                                alt={photo.alt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                          {photos.length > 4 && (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">+{photos.length - 4}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {mainPhoto && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Photo par {mainPhoto.photographer}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Option photo personnalisée */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-full h-px bg-border my-6"></div>
          <p className="text-sm text-muted-foreground mb-4">Ou</p>
        </div>
        
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            useCustomPhoto
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/50'
          }`}
          onClick={handleCustomPhotoSelect}
        >
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                useCustomPhoto ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h5 className={`text-xl font-semibold mb-2 ${
                  useCustomPhoto ? 'text-primary' : 'text-foreground'
                }`}>
                  Utiliser ma propre inspiration
                </h5>
                <p className="text-muted-foreground">
                  Notre IA analysera votre photo d'inspiration pour créer un style personnalisé 
                  basé sur vos préférences.
                </p>
              </div>
              {useCustomPhoto && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload de photo d'inspiration */}
        {useCustomPhoto && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-center">Ajoutez votre photo d'inspiration</h4>
                
                {!inspirationPhoto ? (
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleInspirationPhotoUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">
                        Cliquez pour ajouter une photo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG ou WEBP • Max 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(inspirationPhoto)}
                        alt="Photo d'inspiration"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeInspirationPhoto}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        <strong>{inspirationPhoto.name}</strong> • {(inspirationPhoto.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2"
                      >
                        Changer la photo
                      </Button>
                    </div>
                  </div>
                )}

                {errors.inspirationPhoto && (
                  <p className="text-sm text-red-500 text-center">{errors.inspirationPhoto}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {errors.style && (
        <div className="text-center">
          <p className="text-sm text-red-500">{errors.style}</p>
        </div>
      )}

      {/* Info sur le processus IA */}
      <Card className="bg-secondary/5 border-secondary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Comment fonctionne notre IA ?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Notre intelligence artificielle Banana AI analysera vos photos et appliquera le style choisi 
                pour créer des visualisations photoréalistes de votre rénovation. Le processus prend environ 30-60 secondes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3"
          disabled={(!selectedStyle && !useCustomPhoto) || (useCustomPhoto && !inspirationPhoto)}
        >
          Générer la visualisation IA
        </Button>
      </div>
    </div>
  )
}
