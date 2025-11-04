// Service GPT-4 Vision pour analyse photo et estimation coûts
export interface PhotoAnalysisInput {
  photoUrl: string;
  roomType?: string;
  style?: string;
  clientLocation?: string;
}

export interface MaterialEstimate {
  material: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  supplier: string;
}

export interface LaborEstimate {
  specialty: string;
  hours: number;
  hourlyRate: number;
  totalCost: number;
  description: string;
}

export interface PhotoAnalysisResult {
  dimensions: {
    length: number;
    width: number;
    height: number;
    area: number;
    confidence: number;
  };
  materials: {
    existing: MaterialEstimate[];
    needed: MaterialEstimate[];
  };
  labor: LaborEstimate[];
  complexity: {
    level: 'Simple' | 'Modéré' | 'Complexe' | 'Expert';
    factors: string[];
    multiplier: number;
  };
  timeline: {
    estimated: string;
    phases: Array<{
      phase: string;
      duration: string;
      description: string;
    }>;
  };
  totalCost: {
    materials: number;
    labor: number;
    taxes: number;
    contingency: number;
    total: number;
  };
  recommendations: string[];
  confidence: number;
}

export class GPTVisionAnalysisService {
  private apiKey: string;
  private model = 'gpt-4o'; // GPT-4 avec vision

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzePhoto(input: PhotoAnalysisInput): Promise<PhotoAnalysisResult> {
    try {
      console.log('📸 GPT Vision: Analyse de la photo...');
      
      const prompt = this.buildVisionPrompt(input);
      
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
              content: `Tu es un expert en rénovation et estimation au Québec avec 20 ans d'expérience. 
              Tu analyses les photos avec une précision d'architecte et connais parfaitement:
              - Les prix des matériaux au Québec 2024
              - Les taux horaires des artisans certifiés RBQ
              - Les codes du bâtiment québécois
              - Les techniques de mesure par analyse visuelle
              Tu dois retourner une analyse JSON complète et précise.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: input.photoUrl,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          temperature: 0.2, // Très précis
          max_tokens: 3000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`GPT Vision API error: ${response.status}`);
      }

      const result = await response.json();
      const analysis = JSON.parse(result.choices[0].message.content);
      
      console.log('✅ GPT Vision: Analyse terminée');
      return this.validateAndFormatAnalysis(analysis);

    } catch (error) {
      console.error('❌ Erreur GPT Vision:', error);
      throw error;
    }
  }

  private buildVisionPrompt(input: PhotoAnalysisInput): string {
    return `
ANALYSE PHOTO RÉNOVATION - ESTIMATION PRÉCISE QUÉBEC 2024

MISSION: Analyse cette photo de ${input.roomType || 'pièce'} et fournis une estimation détaillée des coûts de rénovation.

ANALYSE VISUELLE OBLIGATOIRE:
1. DIMENSIONS: Mesure les dimensions en utilisant les éléments de référence (portes=2m, prises=30cm du sol, plinthes=10cm, etc.)
2. MATÉRIAUX: Identifie TOUS les matériaux visibles (sol, murs, plafond, menuiseries)
3. ÉTAT: Évalue l'usure, dégâts, qualité actuelle de chaque surface
4. COMPLEXITÉ: Détecte plomberie, électricité, structures visibles
5. QUANTITÉS: Calcule les m² exacts pour chaque matériau

PRIX QUÉBEC 2024 (OBLIGATOIRE):
MATÉRIAUX:
- Peinture: 4-8$/m² + main-d'œuvre 15-25$/m²
- Carrelage sol: 25-80$/m² + pose 20-40$/m²
- Plancher bois: 40-120$/m² + pose 15-30$/m²
- Plancher vinyle: 20-60$/m² + pose 10-20$/m²
- Armoires cuisine: 800-2500$/m linéaire
- Comptoir quartz: 300-600$/m²

MAIN-D'ŒUVRE 2024:
- Peintre: 45-60$/h
- Carreleur: 55-75$/h  
- Plombier: 70-90$/h
- Électricien: 75-95$/h
- Menuisier: 65-85$/h
- Plâtrier: 50-70$/h

TAXES: TPS 5% + TVQ 9.975% = 14.975% total
CONTINGENCE: 15-20% (standard Québec)

RETOURNE CE JSON EXACT:
{
  "dimensions": {
    "length": number, // mètres
    "width": number,  // mètres  
    "height": number, // mètres
    "area": number,   // m²
    "confidence": number // 0-100%
  },
  "materials": {
    "existing": [
      {
        "material": "string",
        "quantity": number,
        "unit": "m²|m|unité",
        "condition": "Excellent|Bon|Moyen|Mauvais",
        "needsReplacement": boolean
      }
    ],
    "needed": [
      {
        "material": "string",
        "quantity": number,
        "unit": "m²|m|unité", 
        "unitPrice": number,
        "totalPrice": number,
        "supplier": "string"
      }
    ]
  },
  "labor": [
    {
      "specialty": "string",
      "hours": number,
      "hourlyRate": number,
      "totalCost": number,
      "description": "string"
    }
  ],
  "complexity": {
    "level": "Simple|Modéré|Complexe|Expert",
    "factors": ["facteur1", "facteur2"],
    "multiplier": number // 1.0-2.0
  },
  "timeline": {
    "estimated": "X-Y semaines",
    "phases": [
      {
        "phase": "string",
        "duration": "string", 
        "description": "string"
      }
    ]
  },
  "totalCost": {
    "materials": number,
    "labor": number,
    "taxes": number,
    "contingency": number,
    "total": number
  },
  "recommendations": ["conseil1", "conseil2"],
  "confidence": number // 0-100%
}

IMPORTANT: Base tes calculs sur ce que tu VOIS réellement dans la photo. Sois précis sur les dimensions et matériaux détectés.
`;
  }

  private validateAndFormatAnalysis(analysis: any): PhotoAnalysisResult {
    // Validation et formatage des données
    return {
      dimensions: {
        length: analysis.dimensions?.length || 0,
        width: analysis.dimensions?.width || 0,
        height: analysis.dimensions?.height || 2.5,
        area: analysis.dimensions?.area || 0,
        confidence: analysis.dimensions?.confidence || 70
      },
      materials: {
        existing: analysis.materials?.existing || [],
        needed: analysis.materials?.needed || []
      },
      labor: analysis.labor || [],
      complexity: {
        level: analysis.complexity?.level || 'Modéré',
        factors: analysis.complexity?.factors || [],
        multiplier: analysis.complexity?.multiplier || 1.2
      },
      timeline: {
        estimated: analysis.timeline?.estimated || '4-6 semaines',
        phases: analysis.timeline?.phases || []
      },
      totalCost: {
        materials: Math.round(analysis.totalCost?.materials || 0),
        labor: Math.round(analysis.totalCost?.labor || 0),
        taxes: Math.round(analysis.totalCost?.taxes || 0),
        contingency: Math.round(analysis.totalCost?.contingency || 0),
        total: Math.round(analysis.totalCost?.total || 0)
      },
      recommendations: analysis.recommendations || [],
      confidence: analysis.confidence || 75
    };
  }
}
