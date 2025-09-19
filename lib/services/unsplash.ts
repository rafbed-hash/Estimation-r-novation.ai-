// Service pour récupérer des photos d'inspiration depuis Unsplash
// Photos de haute qualité pour les styles de rénovation

interface UnsplashConfig {
  accessKey: string
}

interface UnsplashPhoto {
  id: string
  urls: {
    small: string
    regular: string
    full: string
  }
  alt_description: string
  user: {
    name: string
    username: string
  }
  links: {
    html: string
  }
}

interface UnsplashResponse {
  results: UnsplashPhoto[]
  total: number
  total_pages: number
}

interface InspirationPhoto {
  id: string
  url: string
  alt: string
  photographer: string
  photographerUrl: string
  unsplashUrl: string
}

class UnsplashService {
  private config: UnsplashConfig

  constructor(accessKey: string) {
    this.config = {
      accessKey
    }
  }

  // Récupérer des photos d'inspiration par style et type de pièce
  async getInspirationPhotos(roomType: string, style: string, count: number = 6): Promise<InspirationPhoto[]> {
    try {
      console.log(`🖼️ Fetching ${count} inspiration photos for ${style} ${roomType}`)

      // Construire la requête de recherche
      const query = this.buildSearchQuery(roomType, style)
      
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${this.config.accessKey}`
          }
        }
      )

      if (!response.ok) {
        console.error('❌ Unsplash API Error:', response.status, response.statusText)
        throw new Error(`Erreur API Unsplash: ${response.status}`)
      }

      const data: UnsplashResponse = await response.json()
      
      console.log(`✅ Found ${data.results.length} photos for ${style} ${roomType}`)

      return data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        alt: photo.alt_description || `${style} ${roomType} inspiration`,
        photographer: photo.user.name,
        photographerUrl: `https://unsplash.com/@${photo.user.username}`,
        unsplashUrl: photo.links.html
      }))

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des photos Unsplash:', error)
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
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`❌ Erreur pour ${style} ${roomType}:`, error)
        allPhotos[style] = this.getFallbackPhotos(roomType, style, 4)
      }
    }

    return allPhotos
  }

  private buildSearchQuery(roomType: string, style: string): string {
    // Traduction des types de pièces en anglais pour Unsplash
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
    // Photos de fallback statiques (URLs Unsplash directes)
    const fallbackPhotos = [
      {
        id: 'fallback-1',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        alt: `${style} ${roomType} inspiration`,
        photographer: 'Unsplash',
        photographerUrl: 'https://unsplash.com',
        unsplashUrl: 'https://unsplash.com'
      },
      {
        id: 'fallback-2',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        alt: `${style} ${roomType} inspiration`,
        photographer: 'Unsplash',
        photographerUrl: 'https://unsplash.com',
        unsplashUrl: 'https://unsplash.com'
      },
      {
        id: 'fallback-3',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
        alt: `${style} ${roomType} inspiration`,
        photographer: 'Unsplash',
        photographerUrl: 'https://unsplash.com',
        unsplashUrl: 'https://unsplash.com'
      },
      {
        id: 'fallback-4',
        url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
        alt: `${style} ${roomType} inspiration`,
        photographer: 'Unsplash',
        photographerUrl: 'https://unsplash.com',
        unsplashUrl: 'https://unsplash.com'
      }
    ]

    return fallbackPhotos.slice(0, count)
  }

  // Méthode pour valider la clé API
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.unsplash.com/me', {
        headers: {
          'Authorization': `Client-ID ${this.config.accessKey}`
        }
      })
      return response.ok
    } catch (error) {
      console.error('Erreur validation Unsplash:', error)
      return false
    }
  }
}

export { UnsplashService }
export type { InspirationPhoto, UnsplashPhoto }
