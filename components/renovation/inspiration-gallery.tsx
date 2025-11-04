'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Check,
  Heart,
  Eye,
  ArrowRight
} from "lucide-react"

interface InspirationGalleryProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function InspirationGallery({ data, onUpdate, onNext }: InspirationGalleryProps) {
  const [selectedInspiration, setSelectedInspiration] = useState<any>(null)

  // Images d'inspiration par style et type de pièce
  const inspirationImages = {
    'moderne': {
      'cuisine': [
        { id: 1, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', title: 'Cuisine Moderne Épurée', description: 'Îlot central, finitions blanches' },
        { id: 2, url: 'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop', title: 'Cuisine Moderne Noire', description: 'Électroménagers intégrés, plan de travail quartz' },
        { id: 3, url: 'https://images.unsplash.com/photo-1556909085-4d1b5b8e5c7a?w=400&h=300&fit=crop', title: 'Cuisine Moderne Bois', description: 'Mélange bois et métal, éclairage LED' }
      ],
      'salle-bain': [
        { id: 4, url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop', title: 'Salle de Bain Moderne', description: 'Douche italienne, carrelage grand format' },
        { id: 5, url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop', title: 'Salle de Bain Zen', description: 'Baignoire îlot, matériaux naturels' },
        { id: 6, url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop', title: 'Salle de Bain Luxe', description: 'Marbre, robinetterie dorée' }
      ],
      'salon': [
        { id: 7, url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', title: 'Salon Moderne Ouvert', description: 'Espace ouvert, mobilier épuré' },
        { id: 8, url: 'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop', title: 'Salon Moderne Cosy', description: 'Cheminée moderne, canapé design' },
        { id: 9, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', title: 'Salon Moderne Lumineux', description: 'Grandes fenêtres, couleurs neutres' }
      ]
    },
    'scandinave': {
      'cuisine': [
        { id: 10, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&sat=-20', title: 'Cuisine Scandinave Claire', description: 'Bois clair, blanc, simplicité' },
        { id: 11, url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop', title: 'Cuisine Scandinave Cosy', description: 'Bois naturel, plantes vertes' },
        { id: 12, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&brightness=10', title: 'Cuisine Scandinave Minimaliste', description: 'Lignes épurées, fonctionnalité' }
      ],
      'salle-bain': [
        { id: 13, url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&sat=-30', title: 'Salle de Bain Scandinave', description: 'Bois et blanc, simplicité nordique' },
        { id: 14, url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&sat=-40', title: 'Salle de Bain Nature', description: 'Matériaux naturels, plantes' },
        { id: 15, url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop&brightness=15', title: 'Salle de Bain Hygge', description: 'Ambiance chaleureuse, textiles doux' }
      ],
      'salon': [
        { id: 16, url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&sat=-25', title: 'Salon Scandinave Lumineux', description: 'Bois clair, textiles naturels' },
        { id: 17, url: 'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop&warmth=10', title: 'Salon Scandinave Cosy', description: 'Cheminée, plaids, hygge' },
        { id: 18, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&sat=-35', title: 'Salon Scandinave Épuré', description: 'Minimalisme nordique' }
      ]
    },
    'industriel': {
      'cuisine': [
        { id: 19, url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&contrast=20', title: 'Cuisine Industrielle Loft', description: 'Métal, béton, briques apparentes' },
        { id: 20, url: 'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop&contrast=15', title: 'Cuisine Industrielle Moderne', description: 'Acier inoxydable, îlot métal' },
        { id: 21, url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&contrast=25', title: 'Cuisine Industrielle Vintage', description: 'Métal patiné, bois brut' }
      ],
      'salle-bain': [
        { id: 22, url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&contrast=30', title: 'Salle de Bain Industrielle', description: 'Tuyaux apparents, métal brut' },
        { id: 23, url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&contrast=20', title: 'Salle de Bain Loft', description: 'Béton ciré, robinetterie noire' },
        { id: 24, url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop&contrast=25', title: 'Salle de Bain Urban', description: 'Style urbain, matériaux bruts' }
      ],
      'salon': [
        { id: 25, url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&contrast=20', title: 'Salon Industriel Loft', description: 'Poutres métalliques, briques' },
        { id: 26, url: 'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop&contrast=15', title: 'Salon Industriel Vintage', description: 'Mobilier récupéré, métal patiné' },
        { id: 27, url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&contrast=25', title: 'Salon Industriel Moderne', description: 'Design contemporain, matériaux bruts' }
      ]
    }
  }

  const selectedStyle = data.selectedStyle || 'moderne'
  const roomType = data.rooms?.[0] || 'cuisine'
  
  // État pour les inspirations chargées depuis l'API
  const [loadedInspirations, setLoadedInspirations] = useState<any[]>([])
  const [loadingInspirations, setLoadingInspirations] = useState(false)
  
  // Charger les inspirations depuis l'API au montage
  useEffect(() => {
    const loadInspirations = async () => {
      if (!selectedStyle || !roomType) return
      
      setLoadingInspirations(true)
      try {
        console.log('🎨 Chargement inspirations depuis API...')
        
        // Import dynamique du service API
        const { apiService } = await import('@/lib/services/api-service')
        
        const result = await apiService.getInspiration({
          roomType,
          style: selectedStyle,
          count: 6
        })
        
        if (result.success) {
          console.log('✅ Inspirations chargées:', result.inspirations.length)
          setLoadedInspirations(result.inspirations)
        } else {
          console.log('⚠️ Échec chargement, utilisation fallback')
          setLoadedInspirations([])
        }
      } catch (error) {
        console.error('❌ Erreur chargement inspirations:', error)
        setLoadedInspirations([])
      } finally {
        setLoadingInspirations(false)
      }
    }
    
    loadInspirations()
  }, [selectedStyle, roomType])
  
  // Utiliser les inspirations chargées ou fallback vers les images statiques
  const currentImages = loadedInspirations.length > 0 
    ? loadedInspirations 
    : inspirationImages[selectedStyle as keyof typeof inspirationImages]?.[roomType as keyof typeof inspirationImages['moderne']] || []

  const handleSelectInspiration = (inspiration: any) => {
    setSelectedInspiration(inspiration)
    onUpdate({ 
      ...data,
      selectedInspiration: inspiration
    })
    console.log('🎨 Inspiration sélectionnée:', inspiration)
  }

  const handleNext = () => {
    if (selectedInspiration) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choisissez votre inspiration</h2>
        <p className="text-muted-foreground">
          Sélectionnez le style {selectedStyle} qui vous inspire le plus pour votre {roomType}
        </p>
        <Badge variant="outline" className="mt-2">
          {currentImages.length} inspirations disponibles
        </Badge>
      </div>

      {loadingInspirations && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Chargement des inspirations {selectedStyle}...</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentImages.map((inspiration) => (
          <Card 
            key={inspiration.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedInspiration?.id === inspiration.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : ''
            }`}
            onClick={() => handleSelectInspiration(inspiration)}
          >
            <div className="relative">
              <img
                src={inspiration.url}
                alt={inspiration.title}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkluc3BpcmF0aW9uICR7aW5zcGlyYXRpb24uaWR9PC90ZXh0Pjwvc3ZnPg==`
                }}
              />
              
              {selectedInspiration?.id === inspiration.id && (
                <div className="absolute top-2 right-2">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}
              
              <div className="absolute top-2 left-2">
                <Badge className="bg-black/70 text-white">
                  <Heart className="h-3 w-3 mr-1" />
                  Style {selectedStyle}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{inspiration.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{inspiration.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Eye className="h-3 w-3 mr-1" />
                  Inspiration #{inspiration.id}
                </div>
                
                {selectedInspiration?.id === inspiration.id && (
                  <Badge variant="default" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Sélectionné
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedInspiration && (
        <div className="text-center space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold">Inspiration sélectionnée</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>{selectedInspiration.title}</strong> - {selectedInspiration.description}
              </p>
            </CardContent>
          </Card>
          
          <Button onClick={handleNext} size="lg" className="w-full md:w-auto">
            Transformer ma pièce avec cette inspiration
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {!selectedInspiration && (
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Sélectionnez une inspiration pour continuer la transformation
          </p>
        </div>
      )}
    </div>
  )
}
