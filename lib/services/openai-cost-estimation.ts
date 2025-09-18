// Service pour l'estimation des coûts de rénovation avec OpenAI

interface CostEstimationRequest {
  client: {
    firstName: string
    lastName: string
    city: string
    postalCode: string
  }
  house: {
    propertyType: string
    constructionYear: string
    surface: string
    rooms: string
  }
  selectedRooms: string[]
  selectedStyle: string
  aiAnalysis?: string // Résultat de l'analyse Google AI
}

interface CostBreakdown {
  category: string
  cost: number
  percentage: number
  details?: string[]
}

interface CostEstimationResponse {
  totalCost: {
    min: number
    max: number
    average: number
  }
  breakdown: CostBreakdown[]
  timeline: string
  confidence: string
  factors: string[]
  recommendations: string[]
}

class OpenAICostEstimationService {
  private apiKey: string
  private model: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.model = 'gpt-4-turbo-preview' // Modèle le plus récent pour l'analyse
  }

  async estimateCosts(request: CostEstimationRequest): Promise<CostEstimationResponse> {
    try {
      console.log('🤖 OpenAI: Début de l\'estimation des coûts avec la clé:', this.apiKey.substring(0, 20) + '...')
      const prompt = this.buildCostEstimationPrompt(request)

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en rénovation et estimation de coûts en France. 
              Tu as accès à une base de données de plus de 10,000 projets de rénovation récents.
              Tes estimations sont précises et basées sur les prix du marché français 2024.
              Tu dois retourner une estimation structurée en JSON.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3, // Faible température pour plus de précision
          max_tokens: 2000,
          response_format: { type: "json_object" }
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur API OpenAI: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ OpenAI: Réponse reçue avec succès')
      const estimation = JSON.parse(result.choices[0].message.content)

      return this.validateAndFormatEstimation(estimation)

    } catch (error) {
      console.error('Erreur lors de l\'estimation des coûts:', error)
      // Retourner une estimation de fallback
      return this.getFallbackEstimation(request)
    }
  }

  private buildCostEstimationPrompt(request: CostEstimationRequest): string {
    const roomsText = request.selectedRooms.join(', ')
    const surfacePerRoom = Math.floor(parseInt(request.house.surface) / parseInt(request.house.rooms))

    return `
Estime le coût de rénovation pour ce projet au Canada (2024):

PROPRIÉTÉ:
- Type: ${request.house.propertyType}
- Année construction: ${request.house.constructionYear}
- Surface totale: ${request.house.surface} pi² (pieds carrés)
- Localisation: ${request.client.city} (${request.client.postalCode})

PROJET:
- Pièces à rénover: ${roomsText}
- Style choisi: ${request.selectedStyle}
- Surface estimée par pièce: ~${surfacePerRoom} pi²

INSTRUCTIONS:
1. Calcule les coûts en dollars canadiens (CAD $) pour 2024
2. Utilise les prix du marché canadien (plus élevés qu'aux États-Unis)
3. Base tes calculs sur les pieds carrés (pi²), pas les mètres carrés
4. Considère la localisation canadienne pour ajuster les prix
5. Adapte selon l'âge du bâtiment et le style choisi
6. Inclus tous les postes: matériaux, main-d'œuvre, design, imprévus, taxes (TPS/TVQ si Québec)
7. Utilise les coûts moyens canadiens: $150-300 CAD par pi² selon la complexité

Retourne un JSON avec cette structure exacte:
{
  "totalCost": {
    "min": number,
    "max": number,
    "average": number
  },
  "breakdown": [
    {
      "category": "Matériaux",
      "cost": number,
      "percentage": number,
      "details": ["détail1", "détail2"]
    },
    {
      "category": "Main-d'œuvre",
      "cost": number,
      "percentage": number,
      "details": ["détail1", "détail2"]
    },
    {
      "category": "Design et planification",
      "cost": number,
      "percentage": number,
      "details": ["détail1", "détail2"]
    },
    {
      "category": "Imprévus et divers",
      "cost": number,
      "percentage": number,
      "details": ["détail1", "détail2"]
    }
  ],
  "timeline": "X-Y semaines",
  "confidence": "Élevée/Moyenne/Faible (raison)",
  "factors": ["facteur1", "facteur2", "facteur3"],
  "recommendations": ["recommandation1", "recommandation2"]
}
`
  }

  private validateAndFormatEstimation(estimation: any): CostEstimationResponse {
    // Validation et formatage des données reçues d'OpenAI
    const validated: CostEstimationResponse = {
      totalCost: {
        min: Math.round(estimation.totalCost?.min || 10000),
        max: Math.round(estimation.totalCost?.max || 30000),
        average: Math.round(estimation.totalCost?.average || 20000)
      },
      breakdown: estimation.breakdown?.map((item: any) => ({
        category: item.category || 'Non spécifié',
        cost: Math.round(item.cost || 0),
        percentage: Math.round(item.percentage || 0),
        details: item.details || []
      })) || [],
      timeline: estimation.timeline || '4-8 semaines',
      confidence: estimation.confidence || 'Moyenne',
      factors: estimation.factors || [],
      recommendations: estimation.recommendations || []
    }

    // Vérifier que les pourcentages totalisent 100%
    const totalPercentage = validated.breakdown.reduce((sum, item) => sum + item.percentage, 0)
    if (Math.abs(totalPercentage - 100) > 5) {
      // Ajuster proportionnellement si nécessaire
      const factor = 100 / totalPercentage
      validated.breakdown.forEach(item => {
        item.percentage = Math.round(item.percentage * factor)
      })
    }

    return validated
  }

  private getFallbackEstimation(request: CostEstimationRequest): CostEstimationResponse {
    // Estimation de base en cas d'erreur API - Prix canadiens 2024
    const baseRoomCosts: Record<string, number> = {
      'cuisine': 25000,           // Cuisine complète au Canada
      'salle-de-bain': 18000,     // Salle de bain complète
      'salon': 12000,             // Salon/séjour
      'chambre': 8000,            // Chambre
      'bureau': 7000,             // Bureau/étude
      'entree': 4000,             // Entrée/hall
      'salle-a-manger': 10000,    // Salle à manger
      'garage': 6000              // Garage
    }

    const totalRoomCost = request.selectedRooms.reduce((sum, room) => {
      return sum + (baseRoomCosts[room] || 5000)
    }, 0)

    const styleMultiplier = this.getStyleMultiplier(request.selectedStyle)
    const average = Math.round(totalRoomCost * styleMultiplier)

    return {
      totalCost: {
        min: Math.round(average * 0.8),
        max: Math.round(average * 1.3),
        average
      },
      breakdown: [
        { category: 'Matériaux', cost: Math.round(average * 0.4), percentage: 40 },
        { category: 'Main-d\'œuvre', cost: Math.round(average * 0.45), percentage: 45 },
        { category: 'Design et planification', cost: Math.round(average * 0.1), percentage: 10 },
        { category: 'Imprévus (5%)', cost: Math.round(average * 0.05), percentage: 5 }
      ],
      timeline: '4-6 semaines',
      confidence: 'Moyenne (estimation automatique)',
      factors: ['Surface des pièces', 'Style choisi', 'Âge du bâtiment'],
      recommendations: ['Demander plusieurs devis', 'Prévoir une marge pour les imprévus']
    }
  }

  private getStyleMultiplier(style: string): number {
    const multipliers: Record<string, number> = {
      'moderne': 1.2,
      'classique': 1.4,
      'industriel': 1.1,
      'scandinave': 1.0,
      'campagne': 0.9,
      'spa': 1.3,
      'custom': 1.1
    }

    return multipliers[style] || 1.0
  }

  // Méthode pour valider la clé API
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export { OpenAICostEstimationService }
export type { CostEstimationRequest, CostEstimationResponse, CostBreakdown }
