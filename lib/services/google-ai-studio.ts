// Service pour l'intégration Google AI Studio
// Transformation visuelle des photos de rénovation

interface GoogleAIStudioConfig {
  apiKey: string
  model: string
}

interface ImageTransformationRequest {
  originalPhoto: string // Base64 de la photo originale
  inspirationPhoto?: string // Base64 de la photo d'inspiration
  roomType: string
  selectedStyle: string
  customPrompt?: string
}

interface ImageTransformationResponse {
  originalPhoto: string
  transformedPhoto: string
  description: string
  confidence: number
  processingTime: number
}

class GoogleAIStudioService {
  private config: GoogleAIStudioConfig

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      model: 'gemini-2.5-flash' // Modèle Google Gemini 2.5 Flash Image (Nano Banana)
    }
  }

  async transformImage(request: ImageTransformationRequest): Promise<ImageTransformationResponse> {
    try {
      const startTime = Date.now()

      // Construire le prompt pour Google AI Studio
      const prompt = this.buildTransformationPrompt(
        request.roomType, 
        request.selectedStyle, 
        request.customPrompt,
        !!request.inspirationPhoto
      )

      console.log('🎨 Google AI Studio - Transforming image with prompt:', prompt)

      // Préparer les données pour l'API Google AI Studio
      const requestBody = {
        prompt: prompt,
        image: request.originalPhoto,
        inspiration_image: request.inspirationPhoto || null,
        style: request.selectedStyle,
        room_type: request.roomType,
        settings: {
          quality: 'high',
          style_strength: 0.8,
          creativity: 0.7
        }
      }

      // Appel à l'API Google Gemini 2.5 Flash avec timeout pour Vercel
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 25000) // 25s timeout pour Vercel
      
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': this.config.apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  },
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: this.extractBase64FromPhoto(request.originalPhoto)
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048, // Reduced for faster response
            }
          }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Google AI Studio API Error:', response.status, response.statusText, errorText)
          throw new Error(`Erreur API Google AI Studio: ${response.status} - ${errorText}`)
        }
        
        const result = await response.json()
        const processingTime = Date.now() - startTime

        console.log('✅ Google AI Studio transformation completed in', processingTime, 'ms')
        
        // Traiter la réponse de Google AI Studio (Gemini)
        const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Analyse non disponible'
        
        console.log('📝 Google AI Studio analysis:', analysisText)
        
        // Pour l'instant, retourner l'image originale avec la description d'analyse
        return {
          originalPhoto: request.originalPhoto,
          transformedPhoto: request.originalPhoto, // Sera remplacé par l'analyse IA
          description: analysisText.substring(0, 500) + '...', // Plus de détails de l'analyse
          confidence: 85,
          processingTime: processingTime
        }
        
      } catch (error) {
        clearTimeout(timeoutId)
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Timeout: L\'analyse IA a pris trop de temps. Veuillez réessayer.')
        }
        throw error
      }

    } catch (error) {
      console.error('❌ Erreur lors de la transformation Google AI Studio:', error)
      throw new Error('Impossible de transformer l\'image avec Google AI Studio. Veuillez réessayer.')
    }
  }

  private buildTransformationPrompt(roomType: string, style: string, customPrompt?: string, hasInspiration: boolean = false): string {
    const basePrompt = `
Analysez cette image de ${roomType} et créez une description détaillée de transformation pour le style ${style}.

INSTRUCTIONS:
- Analysez la disposition actuelle, les matériaux, les couleurs et les éléments existants
- Proposez une transformation réaliste vers le style ${style}
- Gardez la même structure architecturale et perspective
- Décrivez précisément les changements de matériaux, couleurs, éclairage et mobilier

STYLE ${style.toUpperCase()}:
${this.getStyleDescription(style)}

${customPrompt ? `Exigences supplémentaires: ${customPrompt}` : ''}

${hasInspiration ? 'Utilisez l\'image d\'inspiration comme référence pour l\'esthétique désirée.' : ''}

RÉPONSE REQUISE:
Fournissez une description détaillée en français de la transformation proposée, en expliquant:
1. L'état actuel de la pièce
2. Les changements spécifiques à apporter
3. Les matériaux et couleurs recommandés
4. Le résultat final attendu

Soyez précis et professionnel dans votre analyse.
`

    return basePrompt.trim()
  }

  private getStyleDescription(style: string): string {
    const styleDescriptions: { [key: string]: string } = {
      'moderne': 'Clean lines, neutral colors (white, gray, black), contemporary materials (glass, metal, concrete), integrated LED lighting, minimalist furniture, sleek fixtures',
      'scandinave': 'Light wood (pine, birch), white and beige palette, natural textiles, green plants, warm lighting, functionality and comfort, cozy atmosphere',
      'industriel': 'Raw metal, exposed concrete, exposed brick, visible piping, dark colors, Edison lighting, steel and reclaimed wood furniture, urban loft feel',
      'classique': 'Noble materials (marble, solid wood), moldings and cornices, elegant colors, crystal chandeliers, traditional refined furniture, timeless elegance',
      'campagne': 'Weathered wood, subway tile, farmhouse sinks, soft colors, natural materials, rustic chic style, vintage elements',
      'spa': 'Natural materials (stone, bamboo), soothing neutral tones, soft lighting, plants, zen and relaxing atmosphere, wellness-focused design',
      'custom': 'Personalized style based on client preferences and inspiration images'
    }

    return styleDescriptions[style] || styleDescriptions['custom']
  }

  private extractBase64FromPhoto(photo: string): string {
    console.log('🔍 Extracting base64 from photo:', photo.substring(0, 50) + '...')
    
    // Si c'est déjà en base64, extraire la partie après la virgule
    if (photo.startsWith('data:image/')) {
      const base64Data = photo.split(',')[1]
      if (!base64Data) {
        console.error('❌ Invalid base64 format: missing data after comma')
        throw new Error('Invalid base64 format: missing data after comma')
      }
      console.log('✅ Extracted base64 data length:', base64Data.length)
      return base64Data
    }
    
    // Si c'est une URL d'objet ou autre format non supporté
    if (photo.startsWith('blob:') || photo.startsWith('http')) {
      console.error('❌ Photo URL detected, Gemini needs base64:', photo.substring(0, 50) + '...')
      throw new Error('Photo must be in base64 format for Gemini API. Please convert blob URLs to base64.')
    }
    
    // Si c'est déjà du base64 pur (sans préfixe data:image/)
    if (photo.length > 100 && /^[A-Za-z0-9+/=]+$/.test(photo)) {
      console.log('✅ Pure base64 detected, length:', photo.length)
      return photo
    }
    
    console.error('❌ Unsupported photo format. Expected base64 data, got:', photo.substring(0, 50) + '...')
    throw new Error(`Unsupported photo format. Expected base64 data, got: ${photo.substring(0, 50)}...`)
  }

  // Méthode pour valider la clé API
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: {
          'X-goog-api-key': this.config.apiKey
        }
      })
      return response.ok
    } catch (error) {
      console.error('Erreur validation Google Gemini:', error)
      return false
    }
  }
}

export { GoogleAIStudioService }
export type { ImageTransformationRequest, ImageTransformationResponse }
