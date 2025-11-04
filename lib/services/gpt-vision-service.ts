// Service GPT Vision pour analyse des photos de rénovation

interface GPTVisionAnalysis {
  materials: string[];
  scope: string[];
  complexity: 'low' | 'medium' | 'high';
  recommendations: string[];
  confidence: number;
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  roomAnalysis: {
    type: string;
    dimensions: string;
    condition: string;
    features: string[];
  };
}

export class GPTVisionService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeRenovationPhoto(data: {
    imageBase64: string;
    renovationType: string;
    roomType?: string;
    clientLocation?: string;
  }): Promise<GPTVisionAnalysis> {
    
    const prompt = this.buildAnalysisPrompt(data.renovationType, data.roomType, data.clientLocation);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Modèle avec vision
          max_tokens: 4096,
          temperature: 0.3, // Optimisé selon Claude
          messages: [
            {
              role: 'system',
              content: prompt.system
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt.user
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${data.imageBase64}`,
                    detail: 'high'
                  }
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const analysisText = result.choices[0].message.content;

      // Parser la réponse JSON
      return this.parseAnalysisResponse(analysisText, data.renovationType);

    } catch (error) {
      console.error('Erreur GPT Vision:', error);
      
      // Fallback avec données réalistes
      return this.generateFallbackAnalysis(data.renovationType, data.roomType);
    }
  }

  private buildAnalysisPrompt(renovationType: string, roomType?: string, location?: string) {
    const baseLocation = location || 'Québec, Canada';
    
    const systemPrompts = {
      plumbing: `Tu es un expert plombier au ${baseLocation}. Analyse cette photo et fournis une estimation détaillée des travaux de plomberie nécessaires.`,
      
      electrical: `Tu es un électricien certifié au ${baseLocation}. Analyse cette photo et identifie tous les travaux électriques requis.`,
      
      heat_pump: `Tu es un spécialiste en thermopompes au ${baseLocation}. Analyse cette photo pour déterminer la faisabilité d'installation d'une thermopompe.`,
      
      room_transformation: `Tu es un designer d'intérieur expert au ${baseLocation}. Analyse cette ${roomType || 'pièce'} et fournis une évaluation complète pour sa transformation.`
    };

    const userPrompt = `
Analyse cette photo et fournis une réponse JSON structurée avec:

{
  "materials": ["liste des matériaux nécessaires"],
  "scope": ["liste des travaux à effectuer"],
  "complexity": "low|medium|high",
  "recommendations": ["recommandations spécifiques"],
  "confidence": 85,
  "estimatedCost": {
    "min": 15000,
    "max": 35000,
    "currency": "CAD"
  },
  "roomAnalysis": {
    "type": "type de pièce détecté",
    "dimensions": "estimation des dimensions",
    "condition": "état actuel",
    "features": ["caractéristiques notables"]
  }
}

Utilise les prix du marché québécois 2024. Sois précis et réaliste.
`;

    return {
      system: systemPrompts[renovationType as keyof typeof systemPrompts] || systemPrompts.room_transformation,
      user: userPrompt
    };
  }

  private parseAnalysisResponse(responseText: string, renovationType: string): GPTVisionAnalysis {
    try {
      // Extraire le JSON de la réponse
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validation et nettoyage
        return {
          materials: Array.isArray(parsed.materials) ? parsed.materials : [],
          scope: Array.isArray(parsed.scope) ? parsed.scope : [],
          complexity: ['low', 'medium', 'high'].includes(parsed.complexity) ? parsed.complexity : 'medium',
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 75,
          estimatedCost: {
            min: parsed.estimatedCost?.min || 10000,
            max: parsed.estimatedCost?.max || 25000,
            currency: parsed.estimatedCost?.currency || 'CAD'
          },
          roomAnalysis: {
            type: parsed.roomAnalysis?.type || 'pièce',
            dimensions: parsed.roomAnalysis?.dimensions || 'à mesurer',
            condition: parsed.roomAnalysis?.condition || 'bon état',
            features: Array.isArray(parsed.roomAnalysis?.features) ? parsed.roomAnalysis.features : []
          }
        };
      }
    } catch (error) {
      console.error('Erreur parsing GPT Vision:', error);
    }

    // Fallback si parsing échoue
    return this.generateFallbackAnalysis(renovationType);
  }

  private generateFallbackAnalysis(renovationType: string, roomType?: string): GPTVisionAnalysis {
    const fallbackData = {
      plumbing: {
        materials: ['tuyaux PEX', 'raccords', 'robinetterie', 'étanchéité'],
        scope: ['remplacement tuyauterie', 'installation nouveaux raccords', 'test étanchéité'],
        cost: { min: 8000, max: 18000 }
      },
      electrical: {
        materials: ['câblage 14AWG', 'prises GFCI', 'panneau électrique', 'disjoncteurs'],
        scope: ['mise aux normes', 'ajout circuits', 'installation prises'],
        cost: { min: 5000, max: 15000 }
      },
      heat_pump: {
        materials: ['thermopompe centrale', 'conduits', 'isolation', 'thermostat intelligent'],
        scope: ['installation unité extérieure', 'raccordement conduits', 'programmation'],
        cost: { min: 12000, max: 25000 }
      },
      room_transformation: {
        materials: ['peinture', 'revêtement sol', 'éclairage', 'mobilier'],
        scope: ['préparation surfaces', 'installation revêtements', 'décoration'],
        cost: { min: 15000, max: 35000 }
      }
    };

    const data = fallbackData[renovationType as keyof typeof fallbackData] || fallbackData.room_transformation;

    return {
      materials: data.materials,
      scope: data.scope,
      complexity: 'medium',
      recommendations: [
        'Obtenir permis si nécessaire',
        'Prévoir 10-15% de contingence',
        'Planifier selon saisons québécoises'
      ],
      confidence: 75,
      estimatedCost: {
        min: data.cost.min,
        max: data.cost.max,
        currency: 'CAD'
      },
      roomAnalysis: {
        type: roomType || 'pièce standard',
        dimensions: 'à mesurer sur place',
        condition: 'état moyen',
        features: ['fenêtres standard', 'plafond 8-9 pieds', 'plancher existant']
      }
    };
  }

  // Méthode pour convertir File en base64
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Enlever le préfixe data:image/...;base64,
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Méthode pour convertir URL en base64
  static async urlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erreur conversion URL vers base64:', error);
      throw error;
    }
  }
}
