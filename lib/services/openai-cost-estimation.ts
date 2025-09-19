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
Estime le coût de rénovation pour ce projet au Québec (2025):

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
1. Calcule les coûts en dollars canadiens (CAD $) pour 2025
2. Utilise les tarifs main-d'œuvre Québec: Plombier 70-90$/h, Électricien 75-95$/h, Menuisier 65-85$/h
3. Base tes calculs sur les pieds carrés (pi²), pas les mètres carrés
4. Inclus les taxes québécoises: TPS 5% + TVQ 9.975% = ~15% total
5. Adapte selon l'âge du bâtiment et le style choisi
6. Considère les spécificités Québec: isolation renforcée, codes du bâtiment, permis RBQ
7. Utilise les coûts moyens Québec 2025: $180-350 CAD par pi² selon la complexité
8. Ajoute 15-20% pour imprévus (standard construction Québec)

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
    // Fourchettes de prix réalistes par pièce - Prix Québec 2025
    // Basé sur les coûts réels de main-d'œuvre et matériaux au Québec
    const roomPriceRanges: Record<string, {min: number, max: number}> = {
      'cuisine': { min: 25000, max: 70000 },        // Cuisine: Main-d'œuvre spécialisée 65-85$/h + matériaux Québec
      'salle-de-bain': { min: 15000, max: 40000 },  // SDB: Plomberie 70-90$/h + carrelage/sanitaires premium
      'salon': { min: 8000, max: 28000 },           // Salon: Peintre 45-60$/h + électricien 75-95$/h
      'chambre': { min: 6000, max: 18000 },         // Chambre: Peinture + plancher + électricité
      'bureau': { min: 5000, max: 15000 },          // Bureau: Aménagement + éclairage spécialisé
      'entree': { min: 3000, max: 10000 },          // Entrée: Revêtements + isolation (climat Québec)
      'salle-a-manger': { min: 7000, max: 22000 },  // Salle à manger: Plancher + éclairage + peinture
      'garage': { min: 4000, max: 12000 }           // Garage: Isolation + chauffage (hiver Québec)
    }

    // Calculer les fourchettes totales
    let totalMin = 0
    let totalMax = 0
    
    request.selectedRooms.forEach(room => {
      const range = roomPriceRanges[room] || { min: 2000, max: 8000 }
      totalMin += range.min
      totalMax += range.max
    })

    // Appliquer le multiplicateur de style
    const styleMultiplier = this.getStyleMultiplier(request.selectedStyle)
    const adjustedMin = Math.round(totalMin * styleMultiplier * 0.9) // Légèrement plus bas pour le min
    const adjustedMax = Math.round(totalMax * styleMultiplier * 1.1) // Légèrement plus haut pour le max
    const average = Math.round((adjustedMin + adjustedMax) / 2)

    return {
      totalCost: {
        min: adjustedMin,
        max: adjustedMax,
        average
      },
      breakdown: [
        { 
          category: 'Matériaux et fournitures', 
          cost: Math.round(average * 0.35), 
          percentage: 35,
          details: ['Revêtements (prix Québec)', 'Électroménager', 'Plomberie/Sanitaires', 'Matériel électrique']
        },
        { 
          category: 'Main-d\'œuvre spécialisée', 
          cost: Math.round(average * 0.50), 
          percentage: 50,
          details: ['Plombier: 70-90$/h', 'Électricien: 75-95$/h', 'Menuisier: 65-85$/h', 'Peintre: 45-60$/h']
        },
        { 
          category: 'Taxes (TPS + TVQ)', 
          cost: Math.round(average * 0.10), 
          percentage: 10,
          details: ['TPS 5%', 'TVQ 9.975%', 'Sur matériaux et main-d\'œuvre']
        },
        { 
          category: 'Imprévus et contingences', 
          cost: Math.round(average * 0.05), 
          percentage: 5,
          details: ['Réparations découvertes', 'Modifications en cours', 'Délais météo (hiver)']
        }
      ],
      timeline: this.getTimelineEstimate(request.selectedRooms.length),
      confidence: 'Estimation générale - Devis requis pour prix précis',
      factors: [
        'Tarifs main-d\'œuvre spécialisée Québec 2025', 
        'Coût matériaux avec transport/douanes', 
        'Taxes provinciales (TPS + TVQ = ~15%)',
        'Climat québécois (isolation, chauffage)',
        'Saison des travaux (hiver +15-20%)'
      ],
      recommendations: [
        'Obtenir 3-4 devis de professionnels certifiés RBQ',
        'Prévoir 15-20% supplémentaire pour imprévus (standard Québec)',
        'Éviter les travaux extérieurs de décembre à mars',
        'Considérer les subventions Rénoclimat disponibles',
        'Vérifier les permis requis par votre municipalité'
      ]
    }
  }

  private getTimelineEstimate(roomCount: number): string {
    // Délais ajustés pour le Québec (permis, disponibilité artisans, hiver)
    if (roomCount === 1) return '3-5 semaines'
    if (roomCount === 2) return '5-8 semaines'
    if (roomCount === 3) return '8-12 semaines'
    return '12-16 semaines'
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
