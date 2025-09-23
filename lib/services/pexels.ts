// Service pour récupérer des photos d'inspiration depuis Pexels
// Photos de haute qualité pour les styles de rénovation

interface PexelsConfig {
  apiKey: string
}

interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  liked: boolean
  alt: string
}

interface PexelsResponse {
  photos: PexelsPhoto[]
  total_results: number
  page: number
  per_page: number
  next_page?: string
}

interface InspirationPhoto {
  id: string
  url: string
  alt: string
  photographer: string
  photographerUrl: string
  sourceUrl: string
}

class PexelsService {
  private config: PexelsConfig

  constructor(apiKey: string) {
    this.config = {
      apiKey
    }
  }

  // Récupérer des photos d'inspiration par style et type de pièce
  async getInspirationPhotos(roomType: string, style: string, count: number = 6): Promise<InspirationPhoto[]> {
    try {
      console.log(`🖼️ Fetching ${count} inspiration photos for ${style} ${roomType}`)

      // Vérifier si nous avons une vraie clé API Pexels
      if (!this.config.apiKey || this.config.apiKey === 'test_key' || this.config.apiKey === 'your_pexels_api_key_here') {
        console.log('⚠️ No valid Pexels API key, using fallback photos')
        return this.getFallbackPhotos(roomType, style, count)
      }

      // Construire la requête de recherche
      const query = this.buildSearchQuery(roomType, style)
      
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': this.config.apiKey
          }
        }
      )

      if (!response.ok) {
        console.error('❌ Pexels API Error:', response.status, response.statusText)
        console.log('🔄 Falling back to static photos')
        return this.getFallbackPhotos(roomType, style, count)
      }

      const data: PexelsResponse = await response.json()
      
      console.log(`✅ Found ${data.photos.length} photos for ${style} ${roomType}`)

      return data.photos.map(photo => ({
        id: photo.id.toString(),
        url: photo.src.medium, // Utiliser medium au lieu de large pour des images plus petites
        alt: photo.alt || `${style} ${roomType} inspiration`,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        sourceUrl: photo.url
      }))

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des photos Pexels:', error)
      console.log('🔄 Using fallback photos due to error')
      // Retourner des photos de fallback
      return this.getFallbackPhotos(roomType, style, count)
    }
  }

  // Récupérer toutes les photos d'inspiration pour tous les styles d'une pièce
  async getAllStylePhotos(roomType: string): Promise<Record<string, InspirationPhoto[]>> {
    const styles = ['moderne', 'scandinave', 'industriel', 'classique', 'campagne', 'spa']
    const allPhotos: Record<string, InspirationPhoto[]> = {}

    for (const style of styles) {
      try {
        allPhotos[style] = await this.getInspirationPhotos(roomType, style, 4)
        // Petit délai pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.error(`❌ Erreur pour ${style} ${roomType}:`, error)
        allPhotos[style] = this.getFallbackPhotos(roomType, style, 4)
      }
    }

    return allPhotos
  }

  private buildSearchQuery(roomType: string, style: string): string {
    // Traduction des types de pièces en anglais pour Pexels
    const roomTranslations: Record<string, string> = {
      'cuisine': 'kitchen',
      'salle-de-bain': 'bathroom',
      'salon': 'living room',
      'chambre-principale': 'master bedroom',
      'chambre': 'bedroom',
      'salle-a-manger': 'dining room',
      'bureau': 'home office',
      'salle-de-bain-secondaire': 'powder room',
      'entree': 'entryway',
      'garage': 'garage'
    }

    // Traduction des styles en anglais
    const styleTranslations: Record<string, string> = {
      'moderne': 'modern',
      'scandinave': 'scandinavian',
      'industriel': 'industrial',
      'classique': 'classic traditional',
      'campagne': 'farmhouse rustic',
      'spa': 'spa zen minimalist'
    }

    const englishRoom = roomTranslations[roomType] || roomType
    const englishStyle = styleTranslations[style] || style

    return `${englishStyle} ${englishRoom} interior design`
  }

  private getFallbackPhotos(roomType: string, style: string, count: number): InspirationPhoto[] {
    // Photos de fallback statiques avec URLs plus petites et variées par style
    const fallbackPhotosByStyle: Record<string, string[]> = {
      'moderne': [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      'scandinave': [
        'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      'industriel': [
        'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      'classique': [
        'https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1444424/pexels-photo-1444424.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      'campagne': [
        'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      'spa': [
        'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    }

    const stylePhotos = fallbackPhotosByStyle[style] || fallbackPhotosByStyle['moderne']
    
    return stylePhotos.slice(0, count).map((url, index) => ({
      id: `fallback-${style}-${index + 1}`,
      url,
      alt: `${style} ${roomType} inspiration`,
      photographer: 'Pexels Community',
      photographerUrl: 'https://pexels.com',
      sourceUrl: 'https://pexels.com'
    }))
  }

  // Méthode pour valider la clé API
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.pexels.com/v1/search?query=test&per_page=1', {
        headers: {
          'Authorization': this.config.apiKey
        }
      })
      return response.ok
    } catch (error) {
      console.error('Erreur validation Pexels:', error)
      return false
    }
  }
}

export { PexelsService }
export type { InspirationPhoto, PexelsPhoto }
