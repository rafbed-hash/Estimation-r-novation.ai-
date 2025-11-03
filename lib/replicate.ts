import Replicate from "replicate";

// Client Replicate configuré
export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Types pour la transformation
export interface TransformInput {
  dimensions: {
    longueur: number;
    largeur: number;
    hauteur: number;
  };
  photosProjetUrls: string[];
  inspirationsUrls: string[];
  style: string;
  palette: string;
}

export interface TransformOutput {
  avantUrl: string;
  apresUrl: string;
  meta: {
    model: string;
    prompt: string;
    processingTime: number;
    timestamp: string;
  };
}

// Modèles disponibles
export const REPLICATE_MODELS = {
  FLUX_KONTEXT_PRO: "black-forest-labs/flux-kontext-pro",
  IDEOGRAM_V3_TURBO: "ideogram-ai/ideogram-v3-turbo", 
  CONTROLNET_INTERIOR: "jagilley/controlnet-interior-design"
} as const;

// Configuration par défaut
export const DEFAULT_MODEL = REPLICATE_MODELS.FLUX_KONTEXT_PRO;

// Fonction utilitaire pour construire le prompt en français québécois
export function buildTransformPrompt(input: TransformInput): string {
  const { dimensions, style, palette } = input;
  
  return `Transformer cette pièce en style ${style} avec palette de couleurs ${palette}. 
Dimensions: ${dimensions.longueur} pieds x ${dimensions.largeur} pieds x ${dimensions.hauteur} pieds. 
Conserver l'architecture existante et les proportions de la pièce. 
Design d'intérieur professionnel, réaliste, haute qualité, éclairage naturel. 
Style québécois moderne et fonctionnel.`;
}

// Mode mock pour développement
export function getMockTransformResult(input: TransformInput): TransformOutput {
  const mockImages = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=800&q=80'
  ];
  
  return {
    avantUrl: input.photosProjetUrls[0] || mockImages[0],
    apresUrl: mockImages[Math.floor(Math.random() * mockImages.length)],
    meta: {
      model: "mock-mode",
      prompt: buildTransformPrompt(input),
      processingTime: Math.floor(Math.random() * 30000) + 15000, // 15-45s simulé
      timestamp: new Date().toISOString()
    }
  };
}
