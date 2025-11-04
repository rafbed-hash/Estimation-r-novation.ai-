import { NextRequest, NextResponse } from 'next/server';
import { GPTVisionService } from '@/lib/services/gpt-vision-service';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log("📸 Début analyse photo GPT Vision...");
    
    // Vérifier la clé API OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    console.log("🔑 OpenAI Key présent:", !!openaiKey);
    
    if (!openaiKey) {
      return NextResponse.json(
        { error: "Clé API OpenAI manquante" },
        { status: 500 }
      );
    }
    
    const body = await req.json();
    console.log("📦 Données reçues:", {
      photoUrl: body.photoUrl ? 'Présente' : 'Manquante',
      roomType: body.roomType,
      style: body.style
    });
    
    // Validation
    if (!body.photoUrl) {
      return NextResponse.json(
        { error: "URL de photo manquante" },
        { status: 400 }
      );
    }
    
    if (!openaiKey) {
      console.log("⚠️ Pas de clé OpenAI, mode Mock");
      // Mode Mock
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      const analysis = {
        materials: ['peinture', 'carrelage', 'bois'],
        scope: ['rénovation complète', 'changement revêtement'],
        complexity: 'medium' as const,
        recommendations: [
          'Prévoir isolation thermique',
          'Vérifier plomberie existante',
          'Optimiser éclairage naturel'
        ],
        confidence: 85 + Math.floor(Math.random() * 10),
        estimatedCost: {
          min: 15000,
          max: 35000,
          currency: 'CAD'
        },
        roomAnalysis: {
          type: body.roomType || 'pièce',
          dimensions: 'à mesurer',
          condition: 'bon état',
          features: ['fenêtres', 'éclairage naturel']
        }
      };
      
      return NextResponse.json({
        success: true,
        analysis,
        meta: {
          processingTime: Date.now() - startTime,
          model: 'gpt-4o-vision (Mock)',
          timestamp: new Date().toISOString(),
          confidence: analysis.confidence
        }
      });
    }

    // Utiliser le vrai service GPT Vision
    console.log("🔍 Utilisation GPT Vision réel...");
    const visionService = new GPTVisionService(openaiKey);
    
    // Convertir l'URL en base64 si nécessaire
    let imageBase64: string;
    if (body.imageBase64) {
      imageBase64 = body.imageBase64;
    } else if (body.photoUrl) {
      imageBase64 = await GPTVisionService.urlToBase64(body.photoUrl);
    } else {
      throw new Error('Image base64 ou photoUrl requis');
    }
    
    const analysis = await visionService.analyzeRenovationPhoto({
      imageBase64,
      renovationType: body.renovationType || 'room_transformation',
      roomType: body.roomType,
      clientLocation: body.clientLocation || 'Québec, Canada'
    });
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Analyse terminée en ${processingTime}ms`);
    
    // Logs détaillés pour debug
    console.log("📊 Résultats analyse:", {
      materials: analysis.materials,
      scope: analysis.scope,
      confidence: analysis.confidence,
      materialsCount: analysis.materials.length,
      estimatedCost: analysis.estimatedCost
    });
    
    return NextResponse.json({
      success: true,
      analysis,
      meta: {
        processingTime,
        model: 'gpt-4o-vision',
        timestamp: new Date().toISOString(),
        confidence: analysis.confidence
      }
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error("❌ Erreur analyse photo:", error);
    
    // Fallback avec estimation basique
    const fallbackAnalysis = {
      dimensions: {
        length: 4,
        width: 3,
        height: 2.5,
        area: 12,
        confidence: 50
      },
      materials: {
        existing: [],
        needed: [
          {
            material: "Peinture murale",
            quantity: 30,
            unit: "m²",
            unitPrice: 25,
            totalPrice: 750,
            supplier: "Benjamin Moore"
          }
        ]
      },
      labor: [
        {
          specialty: "Peintre",
          hours: 8,
          hourlyRate: 55,
          totalCost: 440,
          description: "Préparation et peinture"
        }
      ],
      complexity: {
        level: "Modéré" as const,
        factors: ["Analyse photo impossible"],
        multiplier: 1.2
      },
      timeline: {
        estimated: "2-3 semaines",
        phases: [
          {
            phase: "Préparation",
            duration: "1 jour",
            description: "Préparation des surfaces"
          }
        ]
      },
      totalCost: {
        materials: 750,
        labor: 440,
        taxes: 178,
        contingency: 200,
        total: 1568
      },
      recommendations: [
        "Obtenir devis professionnel pour estimation précise",
        "Photo de meilleure qualité recommandée"
      ],
      confidence: 30
    };
    
    return NextResponse.json({
      success: false,
      analysis: fallbackAnalysis,
      error: "Analyse photo échouée, estimation générale fournie",
      meta: {
        processingTime,
        model: 'fallback',
        timestamp: new Date().toISOString()
      }
    });
  }
}
