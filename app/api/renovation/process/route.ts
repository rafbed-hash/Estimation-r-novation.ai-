import { NextRequest, NextResponse } from 'next/server'
import { GoogleAIStudioService } from '@/lib/services/google-ai-studio'
import { OpenAICostEstimationService } from '@/lib/services/openai-cost-estimation'
import { BananaAIService } from '@/lib/services/banana-ai'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API /renovation/process called')
    const body = await request.json()
    console.log('📦 Body received - client:', body.client?.name, 'house:', body.house?.surface, 'photos:', body.project?.photos?.length)
    
    // Validation des données reçues
    if (!body.client || !body.house || !body.project) {
      console.log('❌ Missing data in request')
      return NextResponse.json(
        { error: 'Données manquantes dans la requête' },
        { status: 400 }
      )
    }

    console.log('✅ Data validation passed')

    // Initialisation des services
    const googleAIKey = process.env.GOOGLE_AI_STUDIO_API_KEY
    const bananaAIKey = process.env.BANANA_API_KEY
    const openAIKey = process.env.OPENAI_API_KEY

    if (!bananaAIKey || !openAIKey) {
      console.log('❌ Missing API keys - Banana AI:', !!bananaAIKey, 'OpenAI:', !!openAIKey)
      return NextResponse.json(
        { error: 'Clés API manquantes (Banana AI et OpenAI requis)' },
        { status: 500 }
      )
    }

    const googleAI = googleAIKey ? new GoogleAIStudioService(googleAIKey) : null
    const bananaAI = new BananaAIService(bananaAIKey)
    const openAI = new OpenAICostEstimationService(openAIKey)

    // Étape 1: Transformation d'images avec Banana AI
    console.log('🍌 Calling Banana AI for image transformation...')
    console.log('🔑 Banana AI Key available:', !!bananaAIKey)
    console.log('📸 Photos received:', body.project.photos?.length || 0)
    console.log('🎨 Selected style:', body.project.selectedStyle)
    console.log('🏠 Selected rooms:', body.project.selectedRooms)
    
    let aiResults
    try {
      // Utiliser Banana AI pour transformer les images
      const transformationResult = await bananaAI.transformPhotos({
        originalPhotos: body.project.photos || [],
        selectedStyle: body.project.selectedStyle,
        roomType: body.project.selectedRooms[0] || 'salle-de-bain',
        customPrompt: body.project.customPrompt
      })
      
      console.log('✅ Banana AI transformation completed')
      console.log('📊 Transformation confidence:', transformationResult.confidence)
      console.log('🖼️ Transformed photos count:', transformationResult.transformedPhotos.length)
      
      aiResults = transformationResult
      
    } catch (error) {
      console.error('❌ Banana AI failed, trying Google Gemini fallback:', error)
      
      // Fallback avec Google Gemini si disponible
      if (googleAI) {
        try {
          const mainPhoto = body.project.photos?.[0]
          const transformationResult = await googleAI.transformImage({
            originalPhoto: mainPhoto,
            roomType: body.project.selectedRooms[0] || 'salle-de-bain',
            selectedStyle: body.project.selectedStyle,
            customPrompt: body.project.customPrompt
          })
          
          aiResults = {
            originalPhotos: [mainPhoto],
            transformedPhotos: [{
              id: '1',
              url: transformationResult.transformedPhoto,
              description: transformationResult.description,
              confidence: transformationResult.confidence
            }],
            confidence: transformationResult.confidence,
            processingTime: transformationResult.processingTime,
            model: 'google-gemini-2.0-flash-fallback',
            prompt: `Transformation ${body.project.selectedStyle} pour ${body.project.selectedRooms.join(', ')}`
          }
          
          console.log('✅ Google Gemini fallback completed')
        } catch (geminiError) {
          console.error('❌ Google Gemini fallback also failed:', geminiError)
          throw error // Rethrow original Banana AI error
        }
      } else {
        throw error
      }
    }
    
    // Si tout échoue, utiliser des résultats simulés
    if (!aiResults) {
      console.log('⚠️ Using simulated results as final fallback')
      aiResults = {
        originalPhotos: body.project.photos || [],
        transformedPhotos: [
          { id: '1', url: body.project.photos?.[0] || '/placeholder-image.svg', description: 'Transformation simulée - Service temporairement indisponible', confidence: 75 }
        ],
        confidence: 75,
        processingTime: 1500,
        model: 'simulation-fallback',
        prompt: `Transformation ${body.project.selectedStyle} pour ${body.project.selectedRooms.join(', ')}`
      }
    }

    // Étape 2: Estimation des coûts avec OpenAI
    console.log('🤖 Calling OpenAI for cost estimation...')
    console.log('🔑 OpenAI Key available:', !!openAIKey)
    
    let costEstimation
    try {
      costEstimation = await openAI.estimateCosts({
        client: body.client,
        house: body.house,
        selectedRooms: body.project.selectedRooms,
        selectedStyle: body.project.selectedStyle,
        aiAnalysis: JSON.stringify(aiResults)
      })
      console.log('✅ OpenAI cost estimation completed:', costEstimation.totalCost)
    } catch (error) {
      console.error('❌ OpenAI failed, using fallback:', error)
      // Fallback pour l'estimation des coûts
      costEstimation = {
        totalCost: {
          min: 15000,
          max: 35000,
          average: 25000
        },
        breakdown: [
          { category: 'Matériaux', cost: 12000, description: 'Revêtements, peinture, accessoires' },
          { category: 'Main-d\'œuvre', cost: 8000, description: 'Installation et finitions' },
          { category: 'Design', cost: 3000, description: 'Conception et plans' },
          { category: 'Imprévus', cost: 2000, description: 'Marge de sécurité (8%)' }
        ],
        timeline: '4-6 semaines',
        recommendations: [
          'Planifiez les travaux hors saison hivernale',
          'Demandez plusieurs devis pour comparer',
          'Prévoyez 10-15% de budget supplémentaire'
        ]
      }
    }

    console.log('✅ All processing completed')

    // Retourner les résultats
    return NextResponse.json({
      success: true,
      data: {
        aiResults,
        costEstimation,
        makeWebhookSent: false,
        makeWebhookMessage: 'Processing completed'
      }
    })

  } catch (error) {
    console.error('❌ Erreur dans l\'API renovation/process:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
