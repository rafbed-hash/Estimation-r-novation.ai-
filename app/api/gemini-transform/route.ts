import { NextRequest, NextResponse } from 'next/server'
import { GeminiImageService } from '@/lib/services/gemini-image-service'

export async function POST(request: NextRequest) {
  try {
    console.log('🎨 API Gemini Transform appelée')
    
    const body = await request.json()
    const { 
      baseImages, 
      inspirationImage, 
      roomType, 
      style, 
      dimensions, 
      clientData, 
      customPrompt 
    } = body

    // Validation des données requises
    if (!baseImages || baseImages.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une image de base est requise' },
        { status: 400 }
      )
    }

    if (!dimensions || !dimensions.totalSqFt) {
      return NextResponse.json(
        { error: 'Les dimensions de la pièce sont requises' },
        { status: 400 }
      )
    }

    if (!clientData || !clientData.client || !clientData.house) {
      return NextResponse.json(
        { error: 'Les données client sont requises' },
        { status: 400 }
      )
    }

    // Récupérer la clé API Gemini
    const geminiApiKey = process.env.GOOGLE_AI_STUDIO_API_KEY || process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      console.log('⚠️ Clé API Gemini manquante - utilisation du mode fallback')
      
      // Mode fallback sans vraie transformation
      return NextResponse.json({
        success: true,
        data: {
          transformedImage: baseImages[0], // Retourner l'image originale
          processingTime: 1000,
          confidence: 75,
          fallback: true,
          message: 'Mode simulation - Configurez GOOGLE_AI_STUDIO_API_KEY pour la vraie transformation'
        }
      })
    }

    // Initialiser le service Gemini
    const geminiService = new GeminiImageService(geminiApiKey)

    console.log('🤖 Transformation Gemini avec dimensions:', dimensions)
    console.log('👤 Client:', clientData.client.firstName, clientData.client.city)
    console.log('🏠 Pièce:', roomType, style, `${dimensions.totalSqFt} pi²`)

    // Appeler le service de transformation
    const result = await geminiService.transformRoomImage({
      baseImages,
      inspirationImage,
      roomType,
      style,
      dimensions,
      clientData,
      customPrompt
    })

    console.log(`✅ Transformation Gemini réussie en ${result.processingTime}ms`)

    return NextResponse.json({
      success: true,
      data: {
        transformedImage: result.transformedImage,
        processingTime: result.processingTime,
        confidence: result.confidence,
        fallback: false,
        prompt: `Transformation ${style} - ${dimensions.totalSqFt} pi² - ${clientData.client.city}`
      }
    })

  } catch (error) {
    console.error('❌ Erreur API Gemini Transform:', error)
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la transformation Gemini',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
