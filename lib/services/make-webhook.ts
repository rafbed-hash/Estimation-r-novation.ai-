// Service pour l'envoi des données vers Make.com

interface MakeWebhookData {
  client: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  house: {
    propertyType: string
    constructionYear: string
    surface: string
    rooms: string
    floors?: string
  }
  project: {
    selectedRooms: string[]
    selectedStyle: string
    useCustomPhoto: boolean
    photosCount: number
  }
  aiResults: {
    transformedPhotos: any[]
    confidence: number
    processingTime: number
  }
  costEstimation: {
    totalCost: {
      min: number
      max: number
      average: number
    }
    breakdown: any[]
    timeline: string
    confidence: string
  }
  metadata: {
    timestamp: string
    source: string
    version: string
  }
}

interface MakeWebhookResponse {
  success: boolean
  message: string
  data?: any
}

class MakeWebhookService {
  private webhookUrl: string
  private apiKey?: string

  constructor(webhookUrl: string, apiKey?: string) {
    this.webhookUrl = webhookUrl
    this.apiKey = apiKey
  }

  async sendProjectData(data: MakeWebhookData): Promise<MakeWebhookResponse> {
    try {
      // Validation des données avant envoi
      this.validateData(data)

      // Enrichissement des données
      const enrichedData = this.enrichData(data)

      // Headers de la requête
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'RenovationApp/1.0'
      }

      // Ajouter la clé API si disponible
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      // Envoi vers Make.com
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(enrichedData)
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`)
      }

      const result = await response.json().catch(() => ({}))

      return {
        success: true,
        message: 'Projet envoyé avec succès',
        data: result
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi vers Make.com:', error)
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'envoi'
      }
    }
  }

  private validateData(data: MakeWebhookData): void {
    // Validation des données client
    if (!data.client.email || !data.client.firstName || !data.client.lastName) {
      throw new Error('Informations client incomplètes')
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.client.email)) {
      throw new Error('Format d\'email invalide')
    }

    // Validation des données maison
    if (!data.house.propertyType || !data.house.surface) {
      throw new Error('Informations de propriété incomplètes')
    }

    // Validation du projet
    if (!data.project.selectedRooms.length) {
      throw new Error('Aucune pièce sélectionnée')
    }

    if (!data.project.selectedStyle) {
      throw new Error('Aucun style sélectionné')
    }
  }

  private enrichData(data: MakeWebhookData): MakeWebhookData & { enriched: any } {
    return {
      ...data,
      enriched: {
        // Calculs supplémentaires
        estimatedDuration: this.calculateProjectDuration(data),
        priorityScore: this.calculatePriorityScore(data),
        marketSegment: this.determineMarketSegment(data),
        
        // Données géographiques
        location: {
          city: data.client.city,
          postalCode: data.client.postalCode,
          region: this.getRegionFromPostalCode(data.client.postalCode)
        },

        // Statistiques du projet
        projectStats: {
          roomsCount: data.project.selectedRooms.length,
          averageCostPerRoom: Math.round(data.costEstimation.totalCost.average / data.project.selectedRooms.length),
          costPerSquareMeter: Math.round(data.costEstimation.totalCost.average / parseInt(data.house.surface)),
          complexityLevel: this.assessComplexity(data)
        },

        // Tags pour segmentation
        tags: this.generateTags(data)
      }
    }
  }

  private calculateProjectDuration(data: MakeWebhookData): string {
    const baseWeeks = data.project.selectedRooms.length * 2
    const styleComplexity = this.getStyleComplexity(data.project.selectedStyle)
    const totalWeeks = Math.ceil(baseWeeks * styleComplexity)
    
    return `${totalWeeks}-${totalWeeks + 2} semaines`
  }

  private calculatePriorityScore(data: MakeWebhookData): number {
    let score = 50 // Score de base

    // Bonus selon le budget
    if (data.costEstimation.totalCost.average > 30000) score += 20
    else if (data.costEstimation.totalCost.average > 15000) score += 10

    // Bonus selon le nombre de pièces
    score += data.project.selectedRooms.length * 5

    // Bonus selon la confiance IA
    score += data.aiResults.confidence * 0.3

    return Math.min(100, Math.round(score))
  }

  private determineMarketSegment(data: MakeWebhookData): string {
    const avgCost = data.costEstimation.totalCost.average

    if (avgCost < 10000) return 'Budget'
    if (avgCost < 25000) return 'Standard'
    if (avgCost < 50000) return 'Premium'
    return 'Luxe'
  }

  private getRegionFromPostalCode(postalCode: string): string {
    const code = postalCode.substring(0, 2)
    const regions: Record<string, string> = {
      '75': 'Île-de-France',
      '77': 'Île-de-France',
      '78': 'Île-de-France',
      '91': 'Île-de-France',
      '92': 'Île-de-France',
      '93': 'Île-de-France',
      '94': 'Île-de-France',
      '95': 'Île-de-France',
      '13': 'Provence-Alpes-Côte d\'Azur',
      '69': 'Auvergne-Rhône-Alpes',
      '33': 'Nouvelle-Aquitaine',
      '31': 'Occitanie',
      '59': 'Hauts-de-France',
      '44': 'Pays de la Loire'
    }

    return regions[code] || 'Autre région'
  }

  private getStyleComplexity(style: string): number {
    const complexity: Record<string, number> = {
      'moderne': 1.0,
      'scandinave': 0.9,
      'industriel': 1.2,
      'classique': 1.4,
      'campagne': 1.1,
      'spa': 1.3,
      'custom': 1.2
    }

    return complexity[style] || 1.0
  }

  private assessComplexity(data: MakeWebhookData): 'Simple' | 'Modéré' | 'Complexe' {
    let complexityScore = 0

    // Facteurs de complexité
    if (data.project.selectedRooms.includes('cuisine')) complexityScore += 3
    if (data.project.selectedRooms.includes('salle-de-bain')) complexityScore += 3
    if (data.project.selectedRooms.length > 3) complexityScore += 2
    if (parseInt(data.house.constructionYear) < 1980) complexityScore += 2
    if (data.costEstimation.totalCost.average > 30000) complexityScore += 2

    if (complexityScore <= 3) return 'Simple'
    if (complexityScore <= 7) return 'Modéré'
    return 'Complexe'
  }

  private generateTags(data: MakeWebhookData): string[] {
    const tags: string[] = []

    // Tags basés sur le type de propriété
    tags.push(`propriete-${data.house.propertyType}`)

    // Tags basés sur les pièces
    data.project.selectedRooms.forEach(room => {
      tags.push(`piece-${room}`)
    })

    // Tags basés sur le style
    tags.push(`style-${data.project.selectedStyle}`)

    // Tags basés sur le budget
    const avgCost = data.costEstimation.totalCost.average
    if (avgCost < 15000) tags.push('budget-economique')
    else if (avgCost < 30000) tags.push('budget-moyen')
    else tags.push('budget-eleve')

    // Tags basés sur la région
    const region = this.getRegionFromPostalCode(data.client.postalCode)
    tags.push(`region-${region.toLowerCase().replace(/[^a-z]/g, '-')}`)

    return tags
  }

  // Méthode pour tester la connexion webhook
  async testWebhook(): Promise<boolean> {
    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Test de connexion webhook'
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      })

      return response.ok
    } catch {
      return false
    }
  }
}

export { MakeWebhookService }
export type { MakeWebhookData, MakeWebhookResponse }
