'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Sparkles, Upload, X, Loader2 } from "lucide-react"
import type { InspirationPhoto } from '@/lib/services/pexels'

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

  // Conseils d'expert par style et pièce
  const getDesignerTip = (styleId: string, roomType: string): string => {
    const tips: Record<string, Record<string, string>> = {
      'moderne': {
        'cuisine': 'Privilégiez les îlots centraux avec plan de travail en quartz blanc et électroménager intégré. L\'éclairage LED sous les armoires créera une ambiance sophistiquée.',
        'salle-de-bain': 'Optez pour une douche à l\'italienne avec carrelage grand format et robinetterie noire mate. Un miroir rétroéclairé apportera la touche finale.',
        'salon': 'Misez sur un canapé modulaire dans les tons neutres et une table basse en verre ou métal. Les murs d\'accent en béton ciré ajoutent du caractère.',
        'chambre': 'Une tête de lit rembourrée et un éclairage indirect créent une atmosphère apaisante. Gardez les couleurs dans une palette monochrome.',
        'default': 'Le style moderne privilégie la fonctionnalité et les lignes épurées. Choisissez des matériaux nobles et limitez la palette de couleurs.'
      },
      'scandinave': {
        'cuisine': 'Les façades en bois clair et les plans de travail blancs sont essentiels. Ajoutez des plantes vertes et des textiles naturels pour la chaleur.',
        'salle-de-bain': 'Le bois clair et le blanc dominent. Pensez aux paniers en osier pour le rangement et aux plantes qui aiment l\'humidité.',
        'salon': 'Un canapé beige ou gris clair avec des coussins texturés, un tapis en laine et des bougies créent l\'hygge parfait.',
        'chambre': 'Linge de lit en lin naturel, plaids en laine et luminaires en bois créent une chambre cocooning nordique.',
        'default': 'Le style scandinave mise sur la lumière naturelle et les matériaux authentiques. Privilégiez le bois clair et les tons neutres.'
      },
      'industriel': {
        'cuisine': 'Combinez métal noir et bois brut. Un îlot en acier avec plateau bois et une crédence en briques apparentes sont parfaits.',
        'salle-de-bain': 'Tuyauterie apparente, miroir en métal et carrelage métro noir créent l\'esprit loft authentique.',
        'salon': 'Canapé en cuir vieilli, table basse en métal et bois, et éclairage Edison pour une ambiance urbaine réussie.',
        'chambre': 'Tête de lit en métal, étagères en tuyaux et luminaires suspendus industriels pour un style urbain assumé.',
        'default': 'Le style industriel célèbre les matériaux bruts. Exposez la structure et mélangez métal, bois et béton.'
      },
      'classique': {
        'cuisine': 'Façades moulurées, plans de travail en marbre et îlot central avec colonnes. L\'élégance intemporelle à son apogée.',
        'salle-de-bain': 'Baignoire sur pieds, robinetterie dorée et carrelage en marbre pour une salle de bain digne d\'un palace.',
        'salon': 'Canapés Chesterfield, tables en bois massif et lustres en cristal créent une ambiance raffinée et intemporelle.',
        'chambre': 'Lit à baldaquin, commode ancienne et tissus précieux pour une chambre d\'époque revisitée.',
        'default': 'Le style classique privilégie l\'élégance et les matériaux nobles. Investissez dans des pièces intemporelles de qualité.'
      },
      'campagne': {
        'cuisine': 'Façades en bois patiné, évier en céramique et poutres apparentes. L\'authenticité rustique avec tout le confort moderne.',
        'salle-de-bain': 'Carrelage artisanal, vasque en pierre et miroir en bois patiné pour une salle de bain champêtre chic.',
        'salon': 'Canapé en lin froissé, table basse en bois brut et cheminée en pierre pour un cocon campagnard.',
        'chambre': 'Linge de lit en lin, commode patinée et luminaires en fer forgé pour une chambre bucolique.',
        'default': 'Le style campagne mise sur l\'authenticité et les matériaux naturels vieillis. Privilégiez les finitions patinées.'
      },
      'spa': {
        'cuisine': 'Tons neutres apaisants, matériaux naturels et plantes aromatiques. Créez un espace de bien-être culinaire.',
        'salle-de-bain': 'Pierre naturelle, bambou et éclairage tamisé transforment votre salle de bain en véritable spa privé.',
        'salon': 'Canapé moelleux, coussins en lin et diffuseurs d\'huiles essentielles pour un salon zen et relaxant.',
        'chambre': 'Couleurs apaisantes, textiles naturels et éclairage doux pour une chambre propice à la détente.',
        'default': 'Le style spa privilégie la sérénité et les matériaux naturels. Créez un environnement propice à la relaxation.'
      }
    }

    return tips[styleId]?.[roomType] || tips[styleId]?.['default'] || 'Ce style apportera une ambiance unique à votre espace.'
  }

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

  // Styles avec descriptions d'expert
  const styles = [
    {
      id: 'moderne',
      name: 'Moderne Épuré',
      description: 'L\'essence de la sophistication contemporaine. Des lignes nettes, des matériaux nobles comme le quartz et l\'acier inoxydable, et une palette de couleurs neutres créent un espace intemporel et fonctionnel. Parfait pour ceux qui apprécient la beauté dans la simplicité.',
      tags: ['Minimaliste', 'Sophistiqué', 'Fonctionnel', 'Intemporel']
    },
    {
      id: 'scandinave',
      name: 'Scandinave Hygge',
      description: 'L\'art de vivre nordique dans toute sa splendeur. Le bois clair, les textiles naturels et une abondance de lumière naturelle créent une atmosphère chaleureuse et accueillante. Un style qui célèbre le confort et la simplicité authentique.',
      tags: ['Cocooning', 'Lumineux', 'Naturel', 'Chaleureux']
    },
    {
      id: 'industriel',
      name: 'Industriel Urbain',
      description: 'L\'âme des lofts new-yorkais réinventée. Métal brut, béton ciré et briques apparentes se marient pour créer un caractère unique et authentique. Un style qui assume sa force et révèle la beauté des matériaux bruts.',
      tags: ['Caractère', 'Authentique', 'Urbain', 'Audacieux']
    },
    {
      id: 'classique',
      name: 'Classique Élégant',
      description: 'L\'élégance française dans sa forme la plus raffinée. Moulures délicates, marbres précieux et finitions dorées créent un environnement digne des plus beaux hôtels particuliers. Un style qui traverse les époques avec grâce.',
      tags: ['Raffiné', 'Luxueux', 'Intemporel', 'Prestigieux']
    },
    {
      id: 'campagne',
      name: 'Campagne Chic',
      description: 'Le charme bucolique revisité avec élégance. Bois patinés, céramiques artisanales et textiles naturels évoquent la douceur de vivre à la campagne tout en conservant un raffinement contemporain. L\'authenticité sans compromis.',
      tags: ['Authentique', 'Chaleureux', 'Artisanal', 'Bucolique']
    },
    {
      id: 'spa',
      name: 'Zen & Wellness',
      description: 'Votre sanctuaire de bien-être personnel. Pierres naturelles, bambou et tons apaisants transforment votre espace en véritable havre de paix. Un style qui privilégie la sérénité et l\'harmonie pour un équilibre parfait.',
      tags: ['Apaisant', 'Zen', 'Bien-être', 'Harmonieux']
    }
  ]

  const selectedRoom = data.rooms?.[0] || 'pièce'

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (errors.inspirationPhoto) {
        setErrors(prev => ({ ...prev, inspirationPhoto: '' }))
      }
      if (errors.style) {
        setErrors(prev => ({ ...prev, style: '' }))
      }
      setInspirationPhoto(file)
    }
  }

  const removeCustomPhoto = () => {
    setInspirationPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedStyle && !useCustomPhoto) {
      newErrors.style = 'Veuillez sélectionner un style ou télécharger une photo d\'inspiration'
    }

    if (useCustomPhoto && !inspirationPhoto) {
      newErrors.inspirationPhoto = 'Veuillez télécharger une photo d\'inspiration'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate({ 
        selectedStyle: useCustomPhoto ? null : selectedStyle,
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

      {/* Galerie de styles avec photos d'inspiration */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h4 className="text-2xl font-bold">Découvrez votre style parfait</h4>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            En tant qu'experts en design d'intérieur, nous avons sélectionné ces styles tendance pour transformer votre {selectedRoom}. 
            Chaque style reflète une philosophie unique et créera l'ambiance parfaite pour votre espace.
          </p>
        </div>
        
        {loadingPhotos ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <div className="space-y-2">
                <h5 className="font-semibold">Curation de photos d'inspiration...</h5>
                <p className="text-sm text-muted-foreground">Nous sélectionnons les plus belles réalisations pour votre {selectedRoom}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {styles.map((style) => {
              const photos = stylePhotos[style.id] || []
              const mainPhoto = photos[0]
              const isSelected = selectedStyle === style.id && !useCustomPhoto
              
              return (
                <div key={style.id} className="group">
                  {/* En-tête du style */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-2xl font-bold text-foreground">{style.name}</h5>
                      {isSelected && (
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">
                          ✓ Sélectionné
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                      {style.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {style.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Galerie de photos */}
                  <div 
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'ring-2 ring-primary ring-offset-4 shadow-xl' 
                        : 'hover:shadow-lg hover:scale-[1.02]'
                    }`}
                    onClick={() => handleStyleSelect(style.id)}
                  >
                    {mainPhoto ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl overflow-hidden bg-muted">
                        {/* Photo principale */}
                        <div className="md:col-span-2 relative group/main">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img 
                              src={mainPhoto.url} 
                              alt={mainPhoto.alt}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/main:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                              <p className="text-sm font-medium">Photo principale</p>
                              <p className="text-xs opacity-80">Par {mainPhoto.photographer}</p>
                            </div>
                          </div>
                        </div>

                        {/* Photos secondaires */}
                        <div className="space-y-4">
                          {photos.slice(1, 3).map((photo) => (
                            <div key={photo.id} className="relative group/secondary">
                              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                                <img 
                                  src={photo.url} 
                                  alt={photo.alt}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/secondary:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/10 hover:bg-black/5 transition-colors" />
                              </div>
                            </div>
                          ))}
                          
                          {photos.length > 3 && (
                            <div className="aspect-[4/3] bg-primary/10 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                              <div className="text-center">
                                <Palette className="h-8 w-8 text-primary mx-auto mb-2" />
                                <p className="text-sm font-medium text-primary">+{photos.length - 3} photos</p>
                                <p className="text-xs text-primary/70">d'inspiration</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                        <div className="text-center space-y-3">
                          <Palette className="h-16 w-16 text-muted-foreground mx-auto" />
                          <div>
                            <h6 className="font-semibold text-foreground">Style {style.name}</h6>
                            <p className="text-sm text-muted-foreground">Photos en cours de chargement...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Conseil d'expert */}
                  <div className="mt-6 p-4 bg-secondary/10 rounded-lg border-l-4 border-secondary">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h6 className="font-semibold text-foreground mb-1">Conseil de designer</h6>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {getDesignerTip(style.id, selectedRoom)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                <div className="mt-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {inspirationPhoto ? (
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                        <img
                          src={URL.createObjectURL(inspirationPhoto)}
                          alt="Photo d'inspiration"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeCustomPhoto()
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                      variant="outline"
                      className="mx-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger une photo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {errors.style && (
        <div className="text-center">
          <p className="text-sm text-red-500">{errors.style}</p>
        </div>
      )}

      {errors.inspirationPhoto && (
        <div className="text-center">
          <p className="text-sm text-red-500">{errors.inspirationPhoto}</p>
        </div>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Pourquoi choisir un style ?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Le choix du style guide notre IA dans la génération de votre transformation. Plus votre sélection 
                est précise, plus le résultat correspondra à vos attentes et reflétera votre personnalité.
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
          disabled={!selectedStyle && !useCustomPhoto}
        >
          Continuer avec {selectedStyle ? styles.find(s => s.id === selectedStyle)?.name : 'ma photo personnalisée'}
        </Button>
      </div>
    </div>
  )
}
