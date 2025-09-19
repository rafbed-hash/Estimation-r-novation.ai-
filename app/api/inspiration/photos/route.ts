import { NextRequest, NextResponse } from 'next/server'
import { PexelsService } from '@/lib/services/pexels'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomType = searchParams.get('roomType') || 'salon'
    const style = searchParams.get('style') || 'moderne'
    const count = parseInt(searchParams.get('count') || '6')

    console.log(`🖼️ API /inspiration/photos called for ${style} ${roomType}`)

    // Vérifier la clé API Pexels
    const pexelsKey = process.env.PEXELS_API_KEY

    if (!pexelsKey) {
      console.log('❌ Missing Pexels API key')
      return NextResponse.json(
        { error: 'Clé API Pexels manquante' },
        { status: 500 }
      )
    }

    const pexels = new PexelsService(pexelsKey)

    // Récupérer les photos d'inspiration
    const photos = await pexels.getInspirationPhotos(roomType, style, count)

    console.log(`✅ Retrieved ${photos.length} inspiration photos`)

    return NextResponse.json({
      success: true,
      photos,
      roomType,
      style,
      count: photos.length
    })

  } catch (error) {
    console.error('❌ Erreur dans l\'API inspiration/photos:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des photos d\'inspiration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Route pour récupérer toutes les photos de styles pour une pièce
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roomType } = body

    console.log(`🖼️ API /inspiration/photos POST called for all styles of ${roomType}`)

    const pexelsKey = process.env.PEXELS_API_KEY

    if (!pexelsKey) {
      return NextResponse.json(
        { error: 'Clé API Pexels manquante' },
        { status: 500 }
      )
    }

    const pexels = new PexelsService(pexelsKey)

    // Récupérer toutes les photos de styles pour cette pièce
    const allStylePhotos = await pexels.getAllStylePhotos(roomType)

    console.log(`✅ Retrieved photos for all styles of ${roomType}`)

    return NextResponse.json({
      success: true,
      roomType,
      stylePhotos: allStylePhotos
    })

  } catch (error) {
    console.error('❌ Erreur dans l\'API inspiration/photos POST:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des photos de styles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
