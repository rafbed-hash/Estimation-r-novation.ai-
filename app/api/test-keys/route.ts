import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Vérifier les variables d'environnement
    const googleAIKey = process.env.GOOGLE_AI_STUDIO_API_KEY
    const openAIKey = process.env.OPENAI_API_KEY
    const pexelsKey = process.env.PEXELS_API_KEY
    
    console.log('🔍 Testing API keys...')
    console.log('- Google AI Studio:', !!googleAIKey, googleAIKey ? `(${googleAIKey.substring(0, 10)}...)` : '(missing)')
    console.log('- OpenAI (DALL-E 3):', !!openAIKey, openAIKey ? `(${openAIKey.substring(0, 10)}...)` : '(missing)')
    console.log('- Pexels (Photos):', !!pexelsKey, pexelsKey ? `(${pexelsKey.substring(0, 10)}...)` : '(missing)')
    
    return NextResponse.json({
      success: true,
      keys: {
        googleAI: !!googleAIKey,
        openAI: !!openAIKey,
        pexels: !!pexelsKey
      },
      details: {
        googleAI: googleAIKey ? `${googleAIKey.substring(0, 10)}...` : 'missing',
        openAI: openAIKey ? `${openAIKey.substring(0, 10)}...` : 'missing',
        pexels: pexelsKey ? `${pexelsKey.substring(0, 10)}...` : 'missing'
      },
      message: 'Test des clés API - DALL-E 3 + Photos d\'inspiration Pexels',
      services: {
        imageGeneration: 'DALL-E 3 (OpenAI)',
        inspirationPhotos: 'Pexels API'
      }
    })
  } catch (error) {
    console.error('❌ Error testing keys:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors du test des clés',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
