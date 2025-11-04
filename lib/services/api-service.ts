// Service API centralisé selon les recommandations de Claude

interface APIConfig {
  temperature: number;
  maxTokens: number;
  retryAttempts: number;
  timeout: number;
}

class APIService {
  private config: APIConfig;

  constructor() {
    this.config = {
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.3'),
      maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096'),
      retryAttempts: 3,
      timeout: 30000
    };
  }

  // Méthode générique pour appels API avec retry
  async callWithRetry<T>(
    apiFunction: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`🔄 ${context} - Tentative ${attempt}/${this.config.retryAttempts}`);
        
        const result = await Promise.race([
          apiFunction(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), this.config.timeout)
          )
        ]);

        console.log(`✅ ${context} - Succès`);
        return result;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.log(`❌ ${context} - Tentative ${attempt} échouée:`, lastError.message);
        
        if (attempt < this.config.retryAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.log(`⏳ Attente ${delay}ms avant nouvelle tentative...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`${context} échoué après ${this.config.retryAttempts} tentatives: ${lastError!.message}`);
  }

  // Transformation d'image Google AI
  async transformImage(data: {
    photoUrl: string;
    roomType: string;
    style: string;
    goals?: string;
  }) {
    return this.callWithRetry(async () => {
      const response = await fetch('/api/google-ai-transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    }, 'Transformation Google AI');
  }

  // Analyse photo GPT Vision (à implémenter)
  async analyzePhoto(data: {
    imageBase64: string;
    renovationType: string;
    roomType?: string;
  }) {
    return this.callWithRetry(async () => {
      const response = await fetch('/api/photo-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    }, 'Analyse photo GPT Vision');
  }

  // Récupération d'inspirations Pexels
  async getInspiration(data: {
    roomType: string;
    style: string;
    count?: number;
  }) {
    return this.callWithRetry(async () => {
      const response = await fetch('/api/inspiration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType: data.roomType,
          style: data.style,
          count: data.count || 6
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    }, 'Récupération inspirations Pexels');
  }

  // Estimation de coûts Claude (à implémenter)
  async estimateCosts(data: {
    renovationType: string;
    roomType: string;
    dimensions?: any;
    materials?: any;
    photoAnalysis?: any;
  }) {
    return this.callWithRetry(async () => {
      const response = await fetch('/api/cost-estimation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    }, 'Estimation coûts Claude');
  }

  // Workflow complet de rénovation
  async processRenovation(data: {
    type: 'plumbing' | 'electrical' | 'heat_pump' | 'room_transformation';
    photos: string[];
    details: any;
  }) {
    console.log(`🚀 Début workflow ${data.type}...`);
    
    try {
      const results: any = { type: data.type, success: false };

      // Étape 1: Analyse des photos
      if (data.photos.length > 0) {
        console.log('📷 Analyse des photos...');
        results.photoAnalysis = await this.analyzePhoto({
          imageBase64: data.photos[0],
          renovationType: data.type,
          roomType: data.details.roomType
        });
      }

      // Étape 2: Spécifique selon le type
      switch (data.type) {
        case 'room_transformation':
          // Récupérer inspirations
          results.inspirations = await this.getInspiration({
            roomType: data.details.roomType,
            style: data.details.style
          });

          // Transformer l'image
          if (data.photos.length > 0) {
            results.transformation = await this.transformImage({
              photoUrl: data.photos[0],
              roomType: data.details.roomType,
              style: data.details.style,
              goals: data.details.goals
            });
          }
          break;

        case 'plumbing':
        case 'electrical':
        case 'heat_pump':
          // Estimation directe pour ces types
          break;
      }

      // Étape 3: Estimation des coûts
      console.log('💰 Estimation des coûts...');
      results.costEstimation = await this.estimateCosts({
        renovationType: data.type,
        roomType: data.details.roomType,
        dimensions: data.details.dimensions,
        materials: results.photoAnalysis?.materials,
        photoAnalysis: results.photoAnalysis
      });

      results.success = true;
      console.log(`✅ Workflow ${data.type} terminé avec succès`);
      return results;

    } catch (error) {
      console.error(`❌ Erreur workflow ${data.type}:`, error);
      throw error;
    }
  }
}

// Instance singleton
export const apiService = new APIService();

// Types pour TypeScript
export interface TransformationResult {
  success: boolean;
  avantUrl: string;
  apresUrl: string;
  meta: {
    model: string;
    processingTime: number;
    confidence: number;
    timestamp: string;
    roomType: string;
    style: string;
  };
}

export interface PhotoAnalysisResult {
  materials: string[];
  scope: string[];
  complexity: 'low' | 'medium' | 'high';
  recommendations: string[];
  confidence: number;
}

export interface CostEstimationResult {
  totalMin: number;
  totalMax: number;
  currency: string;
  breakdown: {
    materials: number;
    labor: number;
    permits: number;
    contingency: number;
  };
  timeline: string;
}
