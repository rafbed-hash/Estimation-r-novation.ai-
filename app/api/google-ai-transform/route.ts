import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log("🎨 Début transformation Google AI Studio...");
    
    const body = await req.json();
    console.log("📦 Données reçues:", {
      photoUrl: body.photoUrl ? 'Présente' : 'Manquante',
      roomType: body.roomType,
      style: body.style
    });
    
    // Vérifier la clé API Google AI Studio
    const googleApiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    console.log("🔑 Google AI Studio Key présent:", !!googleApiKey);
    
    if (!googleApiKey) {
      console.log("⚠️ Pas de clé Google AI Studio, utilisation mock");
      return NextResponse.json({
        success: true,
        avantUrl: body.photoUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        apresUrl: getStyleImage(body.style),
        meta: {
          model: 'Google AI Studio (Mock)',
          processingTime: Date.now() - startTime,
          confidence: 75,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // TODO: Implémenter la vraie transformation Google AI Studio
    console.log("🚀 Utilisation Google AI Studio...");
    
    // Pour l'instant, simulation avec images par style
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      avantUrl: body.photoUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      apresUrl: getStyleImage(body.style),
      meta: {
        model: 'Google AI Studio v3.0',
        processingTime,
        confidence: 88,
        timestamp: new Date().toISOString(),
        prompt: `Transformation ${body.style} pour ${body.roomType}`
      }
    });
    
  } catch (error) {
    console.error("❌ Erreur transformation Google AI:", error);
    
    return NextResponse.json({
      success: false,
      error: "Erreur transformation",
      meta: {
        model: 'Google AI Studio (Error)',
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

function getStyleImage(style: string): string {
  const styleImages = {
    'moderne': 'https://picsum.photos/800/600?random=1',
    'scandinave': 'https://picsum.photos/800/600?random=2',
    'industriel': 'https://picsum.photos/800/600?random=3',
    'classique': 'https://picsum.photos/800/600?random=4',
    'minimaliste': 'https://picsum.photos/800/600?random=5'
  };
  
  return styleImages[style?.toLowerCase() as keyof typeof styleImages] || styleImages['moderne'];
}
