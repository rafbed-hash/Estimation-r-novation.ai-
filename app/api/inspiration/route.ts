import { NextRequest, NextResponse } from 'next/server';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log("🎨 Début récupération inspirations Pexels...");
    
    const body = await req.json();
    console.log("📦 Données reçues:", {
      roomType: body.roomType,
      style: body.style,
      count: body.count
    });

    // Validation
    if (!body.roomType || !body.style) {
      return NextResponse.json({
        success: false,
        error: "roomType et style requis"
      }, { status: 400 });
    }

    // Vérifier la clé API Pexels
    const pexelsKey = process.env.PEXELS_API_KEY;
    console.log("🔑 Pexels Key présent:", !!pexelsKey);

    if (!pexelsKey) {
      console.log("⚠️ Pas de clé Pexels, mode Mock");
      return generateMockInspiration(body.roomType, body.style, body.count || 6);
    }

    // Construire la requête de recherche
    const searchQuery = buildSearchQuery(body.roomType, body.style);
    const perPage = Math.min(body.count || 6, 20); // Max 20 par requête Pexels

    console.log(`🔍 Recherche Pexels: "${searchQuery}"`);

    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=${perPage}&orientation=landscape`, {
      headers: {
        'Authorization': pexelsKey
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const pexelsData: PexelsResponse = await response.json();
    console.log(`✅ ${pexelsData.photos.length} photos reçues de Pexels`);

    // Adapter les données pour notre format
    const inspirations = pexelsData.photos.map((photo, index) => ({
      id: photo.id,
      url: photo.src.medium, // 400px optimal
      src: {
        small: photo.src.small,
        medium: photo.src.medium,
        large: photo.src.large,
        original: photo.src.original
      },
      alt: photo.alt || `Inspiration ${body.style} pour ${body.roomType}`,
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      pexels_url: `https://www.pexels.com/photo/${photo.id}/`,
      roomType: body.roomType,
      style: body.style,
      avgColor: photo.avg_color,
      dimensions: {
        width: photo.width,
        height: photo.height
      }
    }));

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      inspirations,
      meta: {
        source: 'Pexels API',
        query: searchQuery,
        totalResults: pexelsData.total_results,
        page: pexelsData.page,
        processingTime,
        timestamp: new Date().toISOString(),
        roomType: body.roomType,
        style: body.style,
        count: inspirations.length
      }
    });

  } catch (error) {
    console.error("❌ Erreur récupération inspirations:", error);
    
    // Fallback vers mock en cas d'erreur
    console.log("🔄 Fallback vers inspirations mock");
    return generateMockInspiration('cuisine', 'moderne', 6);
  }
}

function buildSearchQuery(roomType: string, style: string): string {
  const roomQueries = {
    'cuisine': 'modern kitchen interior design',
    'salle-bain': 'modern bathroom interior design',
    'salon': 'modern living room interior design',
    'chambre': 'modern bedroom interior design',
    'bureau': 'modern office interior design',
    'sous-sol': 'modern basement interior design'
  };

  const styleModifiers = {
    'moderne': 'modern contemporary',
    'scandinave': 'scandinavian nordic minimalist',
    'industriel': 'industrial loft urban',
    'classique': 'classic traditional elegant',
    'minimaliste': 'minimalist clean simple',
    'rustique': 'rustic farmhouse cozy'
  };

  const baseQuery = roomQueries[roomType as keyof typeof roomQueries] || roomQueries['cuisine'];
  const styleModifier = styleModifiers[style as keyof typeof styleModifiers] || styleModifiers['moderne'];

  return `${styleModifier} ${baseQuery} home decor`;
}

function generateMockInspiration(roomType: string, style: string, count: number) {
  const mockPhotos = [];
  
  // Générer des URLs Picsum avec des seeds différents pour chaque combinaison
  const baseSeeds = {
    'moderne': 100,
    'scandinave': 200,
    'industriel': 300,
    'classique': 400,
    'minimaliste': 500,
    'rustique': 600
  };

  const roomSeeds = {
    'cuisine': 10,
    'salle-bain': 20,
    'salon': 30,
    'chambre': 40,
    'bureau': 50,
    'sous-sol': 60
  };

  const baseSeed = (baseSeeds[style as keyof typeof baseSeeds] || 100) + 
                   (roomSeeds[roomType as keyof typeof roomSeeds] || 10);

  for (let i = 0; i < count; i++) {
    const seed = baseSeed + i;
    mockPhotos.push({
      id: seed,
      url: `https://picsum.photos/400/300?random=${seed}`,
      src: {
        small: `https://picsum.photos/200/150?random=${seed}`,
        medium: `https://picsum.photos/400/300?random=${seed}`,
        large: `https://picsum.photos/800/600?random=${seed}`,
        original: `https://picsum.photos/1200/900?random=${seed}`
      },
      alt: `Inspiration ${style} pour ${roomType} #${i + 1}`,
      photographer: 'Picsum Photos',
      photographer_url: 'https://picsum.photos',
      pexels_url: `https://picsum.photos/400/300?random=${seed}`,
      roomType,
      style,
      avgColor: '#f0f0f0',
      dimensions: {
        width: 400,
        height: 300
      }
    });
  }

  return NextResponse.json({
    success: true,
    inspirations: mockPhotos,
    meta: {
      source: 'Mock (Picsum)',
      query: `${style} ${roomType}`,
      totalResults: count,
      page: 1,
      processingTime: 500,
      timestamp: new Date().toISOString(),
      roomType,
      style,
      count: mockPhotos.length
    }
  });
}
