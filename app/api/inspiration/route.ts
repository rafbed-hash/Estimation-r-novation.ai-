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
  // Éléments spécifiques par type de pièce
  const roomElements = {
    'cuisine': ['kitchen', 'cabinets', 'countertop', 'appliances', 'island', 'backsplash'],
    'salle-bain': ['bathroom', 'shower', 'toilet', 'sink', 'vanity', 'tiles', 'bathtub'],
    'salon': ['living room', 'sofa', 'coffee table', 'fireplace', 'tv unit', 'armchair'],
    'chambre': ['bedroom', 'bed', 'nightstand', 'dresser', 'wardrobe', 'headboard'],
    'bureau': ['home office', 'desk', 'chair', 'bookshelf', 'workspace', 'storage'],
    'sous-sol': ['basement', 'renovation', 'finished basement', 'recreation room', 'storage']
  };

  // Modificateurs de style
  const styleModifiers = {
    'moderne': ['modern', 'contemporary', 'sleek', 'minimalist'],
    'scandinave': ['scandinavian', 'nordic', 'white', 'wood', 'cozy', 'hygge'],
    'industriel': ['industrial', 'loft', 'concrete', 'steel', 'exposed', 'urban', 'metal'],
    'classique': ['classic', 'traditional', 'elegant', 'marble', 'granite', 'luxury'],
    'minimaliste': ['minimalist', 'clean', 'simple', 'white', 'uncluttered'],
    'rustique': ['rustic', 'farmhouse', 'wood', 'stone', 'natural', 'cozy', 'country']
  };

  // Construire le prompt dynamiquement
  const roomKeywords = roomElements[roomType as keyof typeof roomElements] || roomElements['cuisine'];
  const styleKeywords = styleModifiers[style as keyof typeof styleModifiers] || styleModifiers['moderne'];

  // Sélectionner les mots-clés les plus importants
  const primaryRoom = roomKeywords[0]; // Ex: 'kitchen'
  const secondaryRoom = roomKeywords.slice(1, 3).join(' '); // Ex: 'cabinets countertop'
  const primaryStyle = styleKeywords[0]; // Ex: 'modern'
  const secondaryStyle = styleKeywords.slice(1, 3).join(' '); // Ex: 'contemporary sleek'

  // Construire le prompt final avec variables
  const searchQuery = `${primaryStyle} ${primaryRoom} ${secondaryStyle} ${secondaryRoom} interior design home renovation`;

  console.log(`🔍 Prompt construit: ${roomType} + ${style} = "${searchQuery}"`);
  
  return searchQuery;
}

function generateMockInspiration(roomType: string, style: string, count: number) {
  // Génération dynamique d'URLs basée sur les variables de pièce
  const basePhotos = {
    'cuisine': [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', // Cuisine moderne
      'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop', // Cuisine blanche
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop', // Cuisine îlot
    ],
    'salle-bain': [
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop', // Salle de bain moderne
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop', // Salle de bain carrelage
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop', // Salle de bain douche
    ],
    'salon': [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', // Salon moderne
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', // Salon canapé
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop', // Salon table basse
    ],
    'chambre': [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop', // Chambre moderne
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&h=300&fit=crop', // Chambre lit
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop', // Chambre cozy
    ],
    'bureau': [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop', // Bureau moderne
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop', // Bureau desk
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop', // Bureau workspace
    ],
    'sous-sol': [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop', // Sous-sol rénové
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop', // Sous-sol moderne
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop&brightness=10', // Sous-sol éclairé
    ]
  };

  // Modificateurs de style pour les URLs
  const styleFilters = {
    'moderne': '&contrast=10&sat=5',
    'scandinave': '&sat=-25&brightness=15',
    'industriel': '&contrast=25&sat=-10',
    'classique': '&warmth=15&sat=10',
    'minimaliste': '&sat=-20&brightness=10',
    'rustique': '&warmth=20&contrast=5'
  };

  // Récupérer les photos de base pour la pièce
  const roomPhotos = basePhotos[roomType as keyof typeof basePhotos] || basePhotos['cuisine'];
  const styleFilter = styleFilters[style as keyof typeof styleFilters] || styleFilters['moderne'];

  // Générer les URLs pour le type de pièce et style
  const mockPhotos = [];
  for (let i = 0; i < Math.min(count, roomPhotos.length); i++) {
    const url = roomPhotos[i] + styleFilter;
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
