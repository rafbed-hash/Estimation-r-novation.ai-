import { NextRequest, NextResponse } from "next/server";
import { replicate, buildTransformPrompt, getMockTransformResult, DEFAULT_MODEL } from "@/lib/replicate";
import { validateTransformInput, TransformInput, TransformOutput } from "@/lib/validations/transform";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log("🎨 Début transformation IA Replicate...");
    
    // Validation de l'input
    const body = await req.json();
    let input: TransformInput;
    
    try {
      input = validateTransformInput(body);
      console.log("✅ Validation input réussie:", {
        photos: input.photosProjetUrls.length,
        inspirations: input.inspirationsUrls.length,
        style: input.style,
        palette: input.palette
      });
    } catch (validationError) {
      console.error("❌ Erreur validation:", validationError);
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: validationError instanceof z.ZodError ? validationError.errors : "Format incorrect"
        },
        { status: 400 }
      );
    }

    // Vérifier si on a le token Replicate
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    
    if (!replicateToken) {
      console.log("⚠️ Mode mock: pas de token Replicate");
      const mockResult = getMockTransformResult(input);
      
      return NextResponse.json({
        success: true,
        ...mockResult,
        meta: {
          ...mockResult.meta,
          mode: "mock",
          message: "Mode développement - transformation simulée"
        }
      });
    }

    // Construction du prompt optimisé
    const prompt = buildTransformPrompt(input);
    console.log("📝 Prompt généré:", prompt);

    // Préparation des paramètres Replicate
    const replicateInput = {
      image: input.photosProjetUrls[0], // Photo principale
      prompt: prompt,
      num_outputs: 1,
      output_format: "png" as const,
      output_quality: 90,
      // Ajouter les images de référence si disponibles
      ...(input.inspirationsUrls.length > 0 && {
        reference_images: input.inspirationsUrls.slice(0, 3) // Max 3 références
      })
    };

    console.log("🚀 Lancement transformation Replicate...");
    
    // Appel à Replicate avec retry
    let output: any;
    let attempts = 0;
    const maxAttempts = 2;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`🔄 Tentative ${attempts}/${maxAttempts}`);
        
        output = await Promise.race([
          replicate.run(DEFAULT_MODEL, { input: replicateInput }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout 90s")), 90000)
          )
        ]);
        
        break; // Succès, sortir de la boucle
        
      } catch (error) {
        console.error(`❌ Tentative ${attempts} échouée:`, error);
        
        if (attempts >= maxAttempts) {
          // Dernière tentative échouée, utiliser le fallback
          console.log("🔄 Utilisation du mode fallback");
          const fallbackResult = getMockTransformResult(input);
          
          return NextResponse.json({
            success: true,
            ...fallbackResult,
            meta: {
              ...fallbackResult.meta,
              mode: "fallback",
              error: error instanceof Error ? error.message : "Erreur inconnue",
              message: "Transformation de secours utilisée"
            }
          });
        }
        
        // Attendre avant retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Traitement du résultat
    const processingTime = Date.now() - startTime;
    
    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error("Aucune image générée par Replicate");
    }

    const result: TransformOutput = {
      avantUrl: input.photosProjetUrls[0],
      apresUrl: output[0], // URL de l'image générée
      meta: {
        model: DEFAULT_MODEL,
        prompt: prompt,
        processingTime: processingTime,
        timestamp: new Date().toISOString()
      }
    };

    console.log("✅ Transformation réussie:", {
      model: result.meta.model,
      processingTime: `${processingTime}ms`,
      avantUrl: result.avantUrl.substring(0, 50) + "...",
      apresUrl: result.apresUrl.substring(0, 50) + "..."
    });

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("❌ Erreur transformation IA:", error);
    
    // Fallback en cas d'erreur critique
    try {
      const body = await req.json();
      const fallbackResult = getMockTransformResult(body);
      
      return NextResponse.json({
        success: true,
        ...fallbackResult,
        meta: {
          ...fallbackResult.meta,
          mode: "error-fallback",
          error: error instanceof Error ? error.message : "Erreur inconnue",
          processingTime: processingTime
        }
      });
      
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          error: "Erreur lors de la transformation IA",
          details: error instanceof Error ? error.message : "Erreur inconnue",
          message: "Oups... on n'a pas pu compléter la transformation. Réessayez, svp."
        },
        { status: 500 }
      );
    }
  }
}

// Méthodes supportées
export async function GET() {
  return NextResponse.json({
    message: "API Transformation IA - Replicate",
    models: [DEFAULT_MODEL],
    status: "active",
    version: "1.0.0"
  });
}
