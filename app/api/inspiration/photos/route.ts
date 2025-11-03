import { NextRequest, NextResponse } from 'next/server'
import { PexelsService } from '@/lib/services/pexels'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomType = searchParams.get('roomType') || 'salon'
    const style = searchParams.get('style') || 'moderne'
    const count = parseInt(searchParams.get('count') || '6')

    console.log(`🖼️ API /inspiration/photos called for ${style} ${roomType}`)

    // Récupérer la clé API Pexels (peut être undefined, le service gérera le fallback)
    const pexelsKey = process.env.PEXELS_API_KEY || 'fallback_key'

    console.log('🔑 Pexels API key status:', pexelsKey ? 'Available' : 'Using fallback')

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

// Route pour récupérer des photos d'inspiration basées sur des requêtes multiples
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { queries, style, count = 8 } = body

    console.log(`🖼️ API /inspiration/photos POST called with queries:`, queries)

    const pexelsKey = process.env.PEXELS_API_KEY
    
    if (!pexelsKey) {
      console.log('⚠️ Pexels API key not found, using fallback photos')
      // Retourner des photos de fallback
      const fallbackPhotos = [
        {
          id: 1,
          src: { medium: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
          alt: `${style} kitchen inspiration`,
          photographer: 'Unsplash'
        },
        {
          id: 2,
          src: { medium: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
          alt: `${style} bathroom inspiration`,
          photographer: 'Unsplash'
        },
        {
          id: 3,
          src: { medium: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
          alt: `${style} bedroom inspiration`,
          photographer: 'Unsplash'
        },
        {
          id: 4,
          src: { medium: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
          alt: `${style} living room inspiration`,
          photographer: 'Unsplash'
        }
      ]
      
      return NextResponse.json(fallbackPhotos.slice(0, count))
    }

    console.log('🔑 Pexels API key found, fetching real photos')

    const pexels = new PexelsService(pexelsKey)
    const allPhotos = []

    // Pour chaque requête, récupérer des photos
    for (const query of queries) {
      try {
        // Extraire le type de pièce et le style de la requête
        const parts = query.split(' ')
        const roomType = parts[parts.length - 1] // dernier mot (kitchen, bathroom, etc.)
        const photos = await pexels.getInspirationPhotos(roomType, style, 2) // 2 photos par requête
        allPhotos.push(...photos)
      } catch (error) {
        console.error(`Error fetching photos for query: ${query}`, error)
      }
    }

    console.log(`✅ Retrieved ${allPhotos.length} inspiration photos`)

    return NextResponse.json(allPhotos.slice(0, count))

  } catch (error) {
    console.error('❌ Erreur dans l\'API inspiration/photos POST:', error)
    
    // Fallback en cas d'erreur
    const fallbackPhotos = [
      {
        id: 1,
        src: { medium: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
        alt: 'Kitchen inspiration',
        photographer: 'Unsplash'
      }
    ]
    
    return NextResponse.json(fallbackPhotos)
  }
}
