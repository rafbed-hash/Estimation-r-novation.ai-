// Service pour la génération d'images avec OpenAI DALL-E 3
// Transformation visuelle des photos de rénovation

interface OpenAIImageConfig {
  apiKey: string
}

interface TransformImageRequest {
  originalPhoto: string
  roomType: string
  selectedStyle: string
  customPrompt?: string
  roomDimensions?: {
    width: string
    length: string
    height: string
  }
}

interface ImageTransformationResponse {
  originalPhoto: string
  transformedPhoto: string
  description: string
  confidence: number
  processingTime: number
}

class OpenAIImageGenerationService {
  private config: OpenAIImageConfig

  constructor(apiKey: string) {
    this.config = {
      apiKey
    }
  }

  async transformImage(request: TransformImageRequest): Promise<ImageTransformationResponse> {
    try {
      const startTime = Date.now()

      // Construire le prompt pour DALL-E 3
      const prompt = this.buildTransformationPrompt(
        request.roomType, 
        request.selectedStyle, 
        request.customPrompt,
        request.roomDimensions
      )

      console.log('🎨 OpenAI DALL-E 3 - Generating transformed image with prompt:', prompt)

      // Appel à l'API OpenAI DALL-E 3
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url"
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ OpenAI DALL-E 3 API Error:', response.status, errorData)
        throw new Error(`Erreur API OpenAI DALL-E 3: ${response.status}`)
      }

      const result = await response.json()
      const processingTime = Date.now() - startTime

      console.log('✅ OpenAI DALL-E 3 generation completed in', processingTime, 'ms')

      // Traiter la réponse d'OpenAI
      const generatedImageUrl = result.data?.[0]?.url
      
      if (!generatedImageUrl) {
        throw new Error('Aucune image générée par DALL-E 3')
      }

      return {
        originalPhoto: request.originalPhoto,
        transformedPhoto: generatedImageUrl,
        description: `Transformation ${request.selectedStyle} générée par DALL-E 3`,
        confidence: 90,
        processingTime: processingTime
      }

    } catch (error) {
      console.error('❌ Erreur lors de la génération DALL-E 3:', error)
      throw new Error('Impossible de générer l\'image avec DALL-E 3. Veuillez réessayer.')
    }
  }

  private buildTransformationPrompt(roomType: string, style: string, customPrompt?: string, dimensions?: {width: string, length: string, height: string}): string {
    // Construire les informations de dimensions
    let dimensionInfo = ''
    if (dimensions && dimensions.width && dimensions.length) {
      const surface = Math.round(parseFloat(dimensions.width) * parseFloat(dimensions.length))
      dimensionInfo = `
ROOM DIMENSIONS:
- Width: ${dimensions.width} feet
- Length: ${dimensions.length} feet
- Height: ${dimensions.height || '8'} feet
- Floor area: ${surface} square feet
- Scale: Design for a ${surface < 100 ? 'compact' : surface < 200 ? 'medium-sized' : 'spacious'} room
`
    }

    const basePrompt = `
Create a photorealistic ${roomType} interior design in ${style} style.

STYLE CHARACTERISTICS:
${this.getStyleDescription(style)}
${dimensionInfo}
REQUIREMENTS:
- Photorealistic rendering
- Professional interior design
- High-quality finishes and materials
- Proper lighting and shadows
- Realistic proportions and perspective${dimensions ? ' matching the specified room dimensions' : ''}
- Modern ${roomType} layout
- Furniture and fixtures appropriately sized for the space

${customPrompt ? `Additional requirements: ${customPrompt}` : ''}

Generate a beautiful, inspiring ${style} ${roomType} that could be featured in a home design magazine${dimensions ? `, with furniture and layout optimized for the ${Math.round(parseFloat(dimensions.width || '0') * parseFloat(dimensions.length || '0'))} sq ft space` : ''}.
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
      'custom': 'Personalized style based on client preferences'
    }

    return styleDescriptions[style] || styleDescriptions['custom']
  }

  // Méthode pour valider la clé API
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })
      return response.ok
    } catch (error) {
      console.error('Erreur validation OpenAI:', error)
      return false
    }
  }
}

export { OpenAIImageGenerationService }
export type { TransformImageRequest, ImageTransformationResponse }
