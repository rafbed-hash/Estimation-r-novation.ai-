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
  // URLs Unsplash spécifiques par type de pièce et style
  const inspirationUrls = {
    'cuisine': {
      'moderne': [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&brightness=10',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&contrast=10',
        'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop&sat=10'
      ],
      'scandinave': [
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&sat=-20',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&sat=-30',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&brightness=15',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&warmth=10',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&sat=-15',
        'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop&sat=-25'
      ],
      'industriel': [
        'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop&contrast=20',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&contrast=25',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&contrast=15',
        'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop&sat=-10',
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&contrast=30',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&contrast=20'
      ]
    },
    'salle-bain': {
      'moderne': [
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&brightness=10',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&contrast=10',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop&sat=10'
      ],
      'scandinave': [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&sat=-30',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&sat=-25',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop&brightness=15',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&warmth=10',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&sat=-20',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop&sat=-35'
      ],
      'industriel': [
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&contrast=30',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&contrast=25',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop&contrast=20',
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&sat=-15',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&contrast=35',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop&contrast=25'
      ]
    },
    'salon': {
      'moderne': [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&brightness=10',
        'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop&contrast=10',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&sat=10'
      ],
      'scandinave': [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&sat=-25',
        'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop&warmth=10',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&sat=-35',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&brightness=15',
        'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop&sat=-20',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&warmth=15'
      ],
      'industriel': [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&contrast=20',
        'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop&contrast=15',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&contrast=25',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&sat=-10',
        'https://images.unsplash.com/photo-1571460633648-d5a4b2b2a7a8?w=400&h=300&fit=crop&contrast=30',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&contrast=20'
      ]
    }
  };

  // Récupérer les URLs pour le type de pièce et style
  const roomUrls = inspirationUrls[roomType as keyof typeof inspirationUrls];
  const styleUrls = roomUrls?.[style as keyof typeof roomUrls] || roomUrls?.['moderne'] || inspirationUrls['cuisine']['moderne'];
  
  const mockPhotos = [];
  for (let i = 0; i < Math.min(count, styleUrls.length); i++) {
    const url = styleUrls[i];
    mockPhotos.push({
      id: 1000 + i,
      url: url,
      title: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} ${style} #${i + 1}`,
      description: `Inspiration ${style} pour ${roomType}`,
      src: {
        small: url.replace('w=400&h=300', 'w=200&h=150'),
        medium: url,
        large: url.replace('w=400&h=300', 'w=800&h=600'),
        original: url.replace('w=400&h=300', 'w=1200&h=900')
      },
      alt: `${roomType} ${style} inspiration #${i + 1}`,
      photographer: 'Unsplash Collection',
      photographer_url: 'https://unsplash.com',
      pexels_url: url,
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
      source: 'Mock (Unsplash Curated)',
      query: `${style} ${roomType}`,
      totalResults: mockPhotos.length,
      page: 1,
      processingTime: 500,
      timestamp: new Date().toISOString(),
      roomType,
      style,
      count: mockPhotos.length
    }
  });
}
