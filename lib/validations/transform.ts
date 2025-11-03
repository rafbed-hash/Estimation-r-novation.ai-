import { z } from "zod";

// Schéma pour les dimensions de la pièce
export const DimensionsSchema = z.object({
  longueur: z.number().min(1).max(100, "Longueur max: 100 pieds"),
  largeur: z.number().min(1).max(100, "Largeur max: 100 pieds"),
  hauteur: z.number().min(6).max(20, "Hauteur entre 6 et 20 pieds")
});

// Styles disponibles
export const StylesDisponibles = [
  "Moderne",
  "Scandinave", 
  "Industriel",
  "Classique",
  "Rustique",
  "Minimaliste",
  "Bohème",
  "Contemporain"
] as const;

// Palettes de couleurs
export const PalettesDisponibles = [
  "Neutre",
  "Chaleureuse",
  "Froide", 
  "Terre",
  "Pastel",
  "Vive",
  "Monochrome",
  "Naturelle"
] as const;

// Schéma pour l'input de transformation
export const TransformInputSchema = z.object({
  dimensions: DimensionsSchema,
  photosProjetUrls: z.array(z.string().url("URL d'image invalide"))
    .min(1, "Au moins une photo requise")
    .max(5, "Maximum 5 photos"),
  inspirationsUrls: z.array(z.string().url("URL d'inspiration invalide"))
    .max(10, "Maximum 10 inspirations"),
  style: z.enum(StylesDisponibles, {
    errorMap: () => ({ message: "Style non supporté" })
  }),
  palette: z.enum(PalettesDisponibles, {
    errorMap: () => ({ message: "Palette non supportée" })
  })
});

// Schéma pour l'output de transformation
export const TransformOutputSchema = z.object({
  avantUrl: z.string().url("URL avant invalide"),
  apresUrl: z.string().url("URL après invalide"),
  meta: z.object({
    model: z.string(),
    prompt: z.string(),
    processingTime: z.number().min(0),
    timestamp: z.string().datetime()
  })
});

// Types TypeScript dérivés
export type TransformInput = z.infer<typeof TransformInputSchema>;
export type TransformOutput = z.infer<typeof TransformOutputSchema>;
export type Dimensions = z.infer<typeof DimensionsSchema>;
export type StyleDisponible = typeof StylesDisponibles[number];
export type PaletteDisponible = typeof PalettesDisponibles[number];

// Validation d'URL d'image avec taille max
export const ImageUrlSchema = z.string().url().refine(
  async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const size = parseInt(contentLength);
        return size <= 10 * 1024 * 1024; // 10 Mo max
      }
      return true;
    } catch {
      return false;
    }
  },
  { message: "Image trop volumineuse (max 10 Mo)" }
);

// Utilitaires de validation
export function validateTransformInput(data: unknown): TransformInput {
  return TransformInputSchema.parse(data);
}

export function validateTransformOutput(data: unknown): TransformOutput {
  return TransformOutputSchema.parse(data);
}
