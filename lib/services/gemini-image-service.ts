// Service Gemini 2.5 Flash Image pour transformation de rénovation
// Version API REST (sans dépendance @google/genai)

interface RoomDimensions {
  length: number // pieds
  width: number // pieds
  height?: number // pieds
  totalSqFt: number // pieds carrés
}

interface ClientFormData {
  client: {
    firstName: string
    lastName: string
    city: string
    postalCode: string
  }
  house: {
    propertyType: string
    constructionYear: string
    surface: string // pieds carrés total
    rooms: string
  }
  project: {
    selectedRooms: string[]
    selectedStyle: string
    urgency?: string
    budget?: string
  }
}

interface GeminiImageRequest {
  baseImages: string[] // Base64 images
  inspirationImage?: string // Base64 inspiration
  roomType: string
  style: string
  dimensions: RoomDimensions
  clientData: ClientFormData
  customPrompt?: string
}

interface GeminiImageResponse {
  transformedImage: string // Data URL
  processingTime: number
  confidence: number
}

export class GeminiImageService {
  private apiKey: string
  private model = 'gemini-2.5-flash-image'
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async transformRoomImage(request: GeminiImageRequest): Promise<GeminiImageResponse> {
    const startTime = Date.now()
    
    try {
      console.log('🎨 Gemini 2.5 Flash - Transforming room image...')
      
      const parts: any[] = []

      // Ajouter les images de base (photos client)
      for (const baseImage of request.baseImages) {
        const base64Data = this.extractBase64Data(baseImage)
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        })
      }

      // Ajouter l'image d'inspiration si disponible
      if (request.inspirationImage) {
        const inspirationBase64 = this.extractBase64Data(request.inspirationImage)
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: inspirationBase64,
          },
        })
      }

      // Construire le prompt intelligent pour rénovation québécoise
      const fullPrompt = this.buildRenovationPrompt(request)
      parts.push({ text: fullPrompt })

      console.log('🤖 Calling Gemini 2.5 Flash API with prompt:', fullPrompt.substring(0, 100) + '...')

      // Appel API REST direct à Gemini
      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: parts
          }],
          generationConfig: {
            responseModalities: ['IMAGE']
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Gemini API Error ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      const firstPart = result.candidates?.[0]?.content?.parts?.[0]

      if (firstPart && firstPart.inlineData) {
        const { data, mimeType } = firstPart.inlineData
        const transformedImage = `data:${mimeType};base64,${data}`
        
        const processingTime = Date.now() - startTime
        console.log(`✅ Gemini transformation completed in ${processingTime}ms`)

        return {
          transformedImage,
          processingTime,
          confidence: 90
        }
      }

      throw new Error("Aucune image générée par Gemini - Réponse vide")

    } catch (error) {
      console.error('❌ Erreur Gemini 2.5 Flash:', error)
      throw new Error('Impossible de transformer l\'image avec Gemini. Vérifiez votre clé API.')
    }
  }

  private buildRenovationPrompt(request: GeminiImageRequest): string {
    const { roomType, style, customPrompt, inspirationImage, dimensions, clientData } = request

    if (inspirationImage) {
      return `
TRANSFORMATION DE RÉNOVATION QUÉBÉCOISE

CONTEXTE CLIENT:
- Nom: ${clientData.client.firstName} ${clientData.client.lastName}
- Localisation: ${clientData.client.city}, ${clientData.client.postalCode}
- Type propriété: ${clientData.house.propertyType}
- Année construction: ${clientData.house.constructionYear}
- Surface totale maison: ${clientData.house.surface} pi²

PIÈCE À RÉNOVER:
- Type: ${roomType}
- Style désiré: ${style}
- Dimensions: ${dimensions.length}' × ${dimensions.width}' (${dimensions.totalSqFt} pi²)
${dimensions.height ? `- Hauteur plafond: ${dimensions.height}'` : ''}
- Budget estimé: ${clientData.project.budget || 'Non spécifié'}
- Urgence: ${clientData.project.urgency || 'Standard'}

INSTRUCTIONS TECHNIQUES:
Les premières images montrent la pièce actuelle de ${dimensions.totalSqFt} pi².
L'image suivante est l'inspiration pour le style ${style}.

OBJECTIF DE TRANSFORMATION:
Générez une image photoréaliste de la pièce rénovée qui:

1. DIMENSIONS EXACTES: Respecte les ${dimensions.length}' × ${dimensions.width}' (${dimensions.totalSqFt} pi²)
2. STYLE ${style.toUpperCase()}: Adopte parfaitement ce style avec matériaux appropriés
3. ARCHITECTURE: Conserve la structure existante (fenêtres, portes, forme)
4. MOBILIER: Ajoute mobilier proportionnel à ${dimensions.totalSqFt} pi²
5. QUÉBEC 2024: Utilise tendances et matériaux locaux
6. BUDGET: Adapte la qualité au budget ${clientData.project.budget || 'moyen'}

SPÉCIFICATIONS QUÉBÉCOISES:
- Éclairage naturel nordique
- Matériaux résistants au climat
- Codes couleurs harmonieux
- Isolation visible si applicable

INSTRUCTIONS SPÉCIFIQUES CLIENT:
"${customPrompt || 'Transformation standard selon le style choisi'}"

RÉSULTAT ATTENDU: Image photoréaliste professionnelle de ${dimensions.totalSqFt} pi² en style ${style}.`
    } else {
      return `
RÉNOVATION STYLE ${style.toUpperCase()} - QUÉBEC

CONTEXTE CLIENT:
- Propriétaire: ${clientData.client.firstName} ${clientData.client.lastName}
- Localisation: ${clientData.client.city}, QC ${clientData.client.postalCode}
- Maison: ${clientData.house.propertyType} (${clientData.house.constructionYear})

PIÈCE À TRANSFORMER:
- Type: ${roomType}
- Dimensions: ${dimensions.length}' × ${dimensions.width}' = ${dimensions.totalSqFt} pi²
${dimensions.height ? `- Hauteur: ${dimensions.height}'` : ''}
- Style cible: ${style}
- Budget: ${clientData.project.budget || 'Standard'}

INSTRUCTIONS DE TRANSFORMATION:
Créez une rénovation ${style} de cette pièce de ${dimensions.totalSqFt} pi² en:

1. RESPECTANT les dimensions exactes ${dimensions.length}' × ${dimensions.width}'
2. APPLIQUANT le style ${style} avec matériaux authentiques
3. CONSERVANT l'architecture existante (murs, fenêtres, portes)
4. AJOUTANT mobilier proportionnel à ${dimensions.totalSqFt} pi²
5. UTILISANT tendances québécoises 2024
6. ADAPTANT au budget ${clientData.project.budget || 'moyen'}

SPÉCIFICATIONS QUÉBEC:
- Éclairage naturel nordique
- Matériaux climat froid
- Codes couleurs locaux
- Efficacité énergétique

DEMANDE SPÉCIFIQUE: "${customPrompt || 'Transformation complète selon style choisi'}"

LIVRABLE: Image photoréaliste professionnelle ${dimensions.totalSqFt} pi² style ${style}.`
    }
  }

  private extractBase64Data(dataUrl: string): string {
    if (dataUrl.startsWith('data:')) {
      return dataUrl.split(',')[1]
    }
    return dataUrl
  }
}
