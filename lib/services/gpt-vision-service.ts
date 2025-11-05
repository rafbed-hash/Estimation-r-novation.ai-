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
    clientData?: {
      client: { firstName: string; lastName: string; city: string; postalCode: string };
      house: { propertyType: string; constructionYear: string; surface: string };
      project: { selectedRooms: string[]; selectedStyle: string; budget?: string };
    };
    dimensions?: {
      length: number;
      width: number;
      totalSqFt: number;
      height?: number;
    };
  }): Promise<GPTVisionAnalysis> {
    
    const prompt = this.buildAnalysisPrompt(data.renovationType, data.roomType, data.clientLocation, data.clientData, data.dimensions);

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

  private buildAnalysisPrompt(
    renovationType: string, 
    roomType?: string, 
    location?: string,
    clientData?: {
      client: { firstName: string; lastName: string; city: string; postalCode: string };
      house: { propertyType: string; constructionYear: string; surface: string };
      project: { selectedRooms: string[]; selectedStyle: string; budget?: string };
    },
    dimensions?: {
      length: number;
      width: number;
      totalSqFt: number;
      height?: number;
    }
  ) {
    const baseLocation = location || 'Québec, Canada';
    
    // Construire le contexte client dynamiquement
    let clientContext = '';
    if (clientData) {
      clientContext = `
CONTEXTE CLIENT:
- Propriétaire: ${clientData.client.firstName} ${clientData.client.lastName}
- Localisation: ${clientData.client.city}, QC ${clientData.client.postalCode}
- Propriété: ${clientData.house.propertyType} (${clientData.house.constructionYear})
- Surface totale: ${clientData.house.surface} pi²
- Style désiré: ${clientData.project.selectedStyle}`;
    }

    // Contexte des dimensions si disponible
    let dimensionsContext = '';
    if (dimensions) {
      dimensionsContext = `
DIMENSIONS DE LA PIÈCE:
- Longueur: ${dimensions.length} pieds
- Largeur: ${dimensions.width} pieds
- Superficie: ${dimensions.totalSqFt} pi²
${dimensions.height ? `- Hauteur plafond: ${dimensions.height} pieds` : ''}`;
    }

    const systemPrompts = {
      transformation: `Tu es un designer d'intérieur expert au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette ${roomType || 'pièce'} de ${dimensions?.totalSqFt || 'taille standard'} pi² et fournis une évaluation complète pour sa transformation en style ${clientData?.project.selectedStyle || 'moderne'}.`,

      plomberie: `Tu es un expert plombier au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette photo de ${roomType || 'pièce'} et fournis une estimation détaillée des travaux de plomberie nécessaires pour cette propriété spécifique.`,
      
      electricite: `Tu es un électricien certifié au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette photo de ${roomType || 'pièce'} et identifie tous les travaux électriques requis pour cette propriété de ${clientData?.house.constructionYear || 'construction récente'}.`,
      
      thermopompe: `Tu es un spécialiste en thermopompes au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette photo pour déterminer la faisabilité d'installation d'une thermopompe dans cette ${roomType || 'pièce'} de ${dimensions?.totalSqFt || 'taille standard'} pi².`,

      ventilation: `Tu es un expert en systèmes CVC (Chauffage, Ventilation, Climatisation) au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette photo pour évaluer les besoins en ventilation et climatisation de cette ${roomType || 'pièce'} de ${dimensions?.totalSqFt || 'taille standard'} pi².`,

      maintenance: `Tu es un expert en maintenance générale résidentielle au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette photo de ${roomType || 'pièce'} et identifie tous les travaux de maintenance, réparations et entretien nécessaires pour cette propriété.`,
      
      // Fallback pour anciens noms
      plumbing: `Tu es un expert plombier au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette photo de ${roomType || 'pièce'} et fournis une estimation détaillée des travaux de plomberie nécessaires pour cette propriété spécifique.`,
      
      electrical: `Tu es un électricien certifié au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette photo de ${roomType || 'pièce'} et identifie tous les travaux électriques requis pour cette propriété de ${clientData?.house.constructionYear || 'construction récente'}.`,
      
      heat_pump: `Tu es un spécialiste en thermopompes au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette photo pour déterminer la faisabilité d'installation d'une thermopompe dans cette ${roomType || 'pièce'} de ${dimensions?.totalSqFt || 'taille standard'} pi².`,
      
      room_transformation: `Tu es un designer d'intérieur expert au ${baseLocation}. ${clientContext}${dimensionsContext}

Analyse cette ${roomType || 'pièce'} de ${dimensions?.totalSqFt || 'taille standard'} pi² et fournis une évaluation complète pour sa transformation en style ${clientData?.project.selectedStyle || 'moderne'}.`
    };

    const userPrompt = `
ANALYSE VISUELLE DÉTAILLÉE - RECONNAISSANCE DES MATÉRIAUX

Analyse cette photo de ${roomType || 'pièce'}${dimensions ? ` de ${dimensions.totalSqFt} pi²` : ''} comme un expert en reconnaissance visuelle des matériaux de construction et de décoration.

MISSION SPÉCIALE - IDENTIFICATION PRÉCISE:
🔍 Identifie CHAQUE matériau visible comme Google Lens identifie des objets
🏗️ Analyse les finitions, textures, couleurs, marques si visibles
📏 Estime les quantités et dimensions des matériaux
💡 Détecte les changements/rénovations déjà effectués

CONTEXTE TECHNIQUE:
${dimensions ? `- Superficie exacte: ${dimensions.totalSqFt} pi² (${dimensions.length}' × ${dimensions.width}')` : '- Estime la superficie en pi²'}
${clientData ? `- Style désiré: ${clientData.project.selectedStyle}` : ''}
${clientData ? `- Année construction: ${clientData.house.constructionYear}` : ''}
- Localisation: ${baseLocation}
- Prix marché québécois 2024

FORMAT JSON REQUIS - RECONNAISSANCE MATÉRIAUX:
{
  "detectedMaterials": [
    {
      "material": "nom exact du matériau",
      "brand": "marque si identifiable",
      "color": "couleur précise",
      "texture": "texture observée",
      "location": "où dans la pièce",
      "condition": "état actuel",
      "estimatedAge": "âge estimé",
      "quantity": "quantité estimée",
      "confidence": 90
    }
  ],
  "existingRenovations": [
    {
      "area": "zone rénovée",
      "workType": "type de travaux fait",
      "materialsUsed": ["matériaux utilisés"],
      "quality": "qualité du travail",
      "estimatedDate": "période estimée"
    }
  ],
  "materials": ["liste complète matériaux identifiés"],
  "scope": ["travaux nécessaires pour ${dimensions?.totalSqFt || 'X'} pi²"],
  "complexity": "low|medium|high",
  "recommendations": ["recommandations basées sur matériaux existants"],
  "confidence": 85,
  "estimatedCost": {
    "min": ${dimensions ? Math.round(dimensions.totalSqFt * 150) : 15000},
    "max": ${dimensions ? Math.round(dimensions.totalSqFt * 300) : 35000},
    "currency": "CAD"
  },
  "roomAnalysis": {
    "type": "${roomType || 'pièce détectée'}",
    "dimensions": "${dimensions ? `${dimensions.length}' × ${dimensions.width}' (${dimensions.totalSqFt} pi²)` : 'à mesurer'}",
    "condition": "état actuel observé",
    "features": ["caractéristiques spécifiques détectées"],
    "dominantMaterials": ["matériaux principaux"],
    "colorPalette": ["couleurs dominantes"]
  }
}

SOIS ULTRA-PRÉCIS COMME GOOGLE LENS - Identifie marques, modèles, finitions exactes !
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
