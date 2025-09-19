import { NextRequest, NextResponse } from 'next/server'
import { UnsplashService } from '@/lib/services/unsplash'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomType = searchParams.get('roomType') || 'salon'
    const style = searchParams.get('style') || 'moderne'
    const count = parseInt(searchParams.get('count') || '6')

    console.log(`🖼️ API /inspiration/photos called for ${style} ${roomType}`)

    // Vérifier la clé API Unsplash
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY

    if (!unsplashKey) {
      console.log('❌ Missing Unsplash API key')
      return NextResponse.json(
        { error: 'Clé API Unsplash manquante' },
        { status: 500 }
      )
    }

    const unsplash = new UnsplashService(unsplashKey)

    // Récupérer les photos d'inspiration
    const photos = await unsplash.getInspirationPhotos(roomType, style, count)

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

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY

    if (!unsplashKey) {
      return NextResponse.json(
        { error: 'Clé API Unsplash manquante' },
        { status: 500 }
      )
    }

    const unsplash = new UnsplashService(unsplashKey)

    // Récupérer toutes les photos de styles pour cette pièce
    const allStylePhotos = await unsplash.getAllStylePhotos(roomType)

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
