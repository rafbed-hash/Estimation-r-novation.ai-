import { NextRequest, NextResponse } from 'next/server'
import { GoogleAIStudioService } from '@/lib/services/google-ai-studio'
import { OpenAICostEstimationService } from '@/lib/services/openai-cost-estimation'

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

    // Initialisation des services avec Nano Banana (Gemini 2.5 Flash)
    const nanoBananaKey = 'AIzaSyC1x0c6u7dnez9UlwuyVZtbX9pXzMzNU8U' // Clé Nano Banana
    const openAIKey = process.env.OPENAI_API_KEY

    console.log('🔑 API Keys check:')
    console.log('- Nano Banana (Gemini 2.5 Flash):', !!nanoBananaKey)
    console.log('- OpenAI:', !!openAIKey)

    if (!openAIKey) {
      console.log('❌ Missing API keys - OpenAI:', !!openAIKey)
      return NextResponse.json(
        { 
          error: 'Clé API OpenAI manquante pour l\'estimation des coûts',
          details: {
            openAI: !!openAIKey,
            nanoBanana: !!nanoBananaKey
          }
        },
        { status: 500 }
      )
    }

    const nanoBananaAI = new GoogleAIStudioService(nanoBananaKey)
    const openAI = new OpenAICostEstimationService(openAIKey)

    // Étape 1: Transformation d'images avec Nano Banana (Gemini 2.5 Flash)
    console.log('🍌 Calling Nano Banana for image transformation...')
    console.log('🔑 Nano Banana Key available:', !!nanoBananaKey)
    console.log('📸 Photos received:', body.project.photos?.length || 0)
    console.log('🎨 Selected style:', body.project.selectedStyle)
    console.log('🏠 Selected rooms:', body.project.selectedRooms)
    
    let aiResults
    try {
      // Utiliser Nano Banana (Gemini 2.5 Flash) pour analyser et transformer les images
      const mainPhoto = body.project.photos?.[0]
      
      if (!mainPhoto) {
        throw new Error('Aucune photo fournie pour la transformation')
      }
      
      console.log('🍌 Analyzing image with Nano Banana (Gemini 2.5 Flash)...')
      
      // Récupérer les dimensions de la première pièce sélectionnée
      const firstRoom = body.project.selectedRooms[0] || 'salle-de-bain'
      
      console.log('📏 Room type:', firstRoom)
      
      const transformationResult = await nanoBananaAI.transformImage({
        originalPhoto: mainPhoto,
        roomType: firstRoom,
        selectedStyle: body.project.selectedStyle,
        customPrompt: body.project.customPrompt,
        inspirationPhoto: body.project.inspirationPhoto
      })
      
      console.log('✅ Nano Banana analysis completed')
      console.log('📊 Analysis confidence:', transformationResult.confidence)
      console.log('📝 Analysis description:', transformationResult.description.substring(0, 100) + '...')
      
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
        model: 'gemini-2.5-flash',
        prompt: `Analyse ${body.project.selectedStyle} pour ${body.project.selectedRooms.join(', ')}`
      }
      
    } catch (error) {
      console.error('❌ Nano Banana failed, using fallback:', error)
      
      // Utiliser des résultats de fallback avec analyse basique
      const mainPhoto = body.project.photos?.[0]
      aiResults = {
        originalPhotos: [mainPhoto || ''],
        transformedPhotos: [{
          id: '1',
          url: mainPhoto || '/placeholder-image.svg',
          description: `Analyse de style ${body.project.selectedStyle} - Service temporairement indisponible. Votre photo sera analysée dès que le service sera rétabli.`,
          confidence: 70
        }],
        confidence: 70,
        processingTime: 1000,
        model: 'nano-banana-fallback',
        prompt: `Analyse ${body.project.selectedStyle} pour ${body.project.selectedRooms.join(', ')}`
      }
      
      console.log('⚠️ Using Nano Banana fallback results')
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
    console.error('❌ Error type:', typeof error)
    console.error('❌ Error constructor:', error?.constructor?.name)
    
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: typeof error,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
