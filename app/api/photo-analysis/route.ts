import { NextRequest, NextResponse } from 'next/server';
import { GPTVisionAnalysisService } from '@/lib/services/gpt-vision-analysis';

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
    
    // Initialiser le service GPT Vision
    const visionService = new GPTVisionAnalysisService(openaiKey);
    
    // Analyser la photo
    console.log("🔍 Lancement analyse GPT Vision...");
    const analysis = await visionService.analyzePhoto({
      photoUrl: body.photoUrl,
      roomType: body.roomType || 'pièce',
      style: body.style || 'moderne',
      clientLocation: body.clientLocation || 'Québec'
    });
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Analyse terminée en ${processingTime}ms`);
    
    // Logs détaillés pour debug
    console.log("📊 Résultats analyse:", {
      dimensions: analysis.dimensions,
      totalCost: analysis.totalCost.total,
      confidence: analysis.confidence,
      materialsCount: analysis.materials.needed.length,
      laborCount: analysis.labor.length
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
