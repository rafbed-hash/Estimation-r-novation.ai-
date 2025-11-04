import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { selectedRooms, selectedStyle, transformationGoals, photos, houseInfo } = body

    console.log('💰 Estimation de coûts demandée:', {
      rooms: selectedRooms,
      style: selectedStyle,
      goals: transformationGoals,
      houseSize: houseInfo?.size
    })

    // Vérifier si nous avons la clé API OpenAI/GPT
    const openaiKey = process.env.OPENAI_API_KEY
    
    if (!openaiKey) {
      console.log('⚠️ OpenAI API key not found, using fallback estimation')
      return getFallbackEstimation(selectedRooms, selectedStyle)
    }

    // Construire le prompt pour GPT avec les prix québécois actuels
    const prompt = `Tu es un expert en rénovation au Québec. Analyse et estime le coût RÉALISTE de ce projet de rénovation en 2024.

PROJET:
- Pièces: ${selectedRooms.join(', ')}
- Style: ${selectedStyle}
- Objectifs: ${transformationGoals || 'Rénovation standard'}
- Superficie estimée: ${houseInfo?.size || 'Non spécifiée'}

CONSIGNES IMPORTANTES:
1. Utilise les PRIX ACTUELS 2024 au Québec (inflation incluse)
2. Inclus la TVQ (9.975%) et TPS (5%) = 14.975% total
3. Taux horaire moyen Québec 2024: 45-85$/h selon spécialité
4. Matériaux: prix actuels avec inflation
5. Donne une fourchette MIN-MAX réaliste en CAD

DÉTAILLE PAR CATÉGORIE:
- Matériaux (prix actuels québécois)
- Main d'œuvre (taux horaires 2024)
- Permis et inspections (tarifs municipaux)
- Électricité/Plomberie si nécessaire
- Finitions selon le style choisi
- Contingence 10-15%

FORMAT DE RÉPONSE (JSON strict):
{
  "totalMin": nombre,
  "totalMax": nombre,
  "currency": "CAD",
  "breakdown": [
    {"category": "Matériaux", "min": nombre, "max": nombre, "details": "description"},
    {"category": "Main d'œuvre", "min": nombre, "max": nombre, "details": "description"},
    {"category": "Permis", "min": nombre, "max": nombre, "details": "description"},
    {"category": "Finitions", "min": nombre, "max": nombre, "details": "description"},
    {"category": "Contingence", "min": nombre, "max": nombre, "details": "description"}
  ],
  "assumptions": ["liste des hypothèses"],
  "recommendations": ["conseils d'économie"],
  "timeline": "durée estimée",
  "priceDate": "2024-11"
}`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en estimation de coûts de rénovation au Québec. Tu connais parfaitement les prix actuels des matériaux, les taux horaires des entrepreneurs, et la réglementation québécoise. Réponds UNIQUEMENT en JSON valide.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const result = await response.json()
      const gptResponse = result.choices[0]?.message?.content

      if (!gptResponse) {
        throw new Error('No response from GPT')
      }

      // Parser la réponse JSON de GPT
      let estimation
      try {
        // Nettoyer la réponse si elle contient du markdown
        const cleanJson = gptResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        estimation = JSON.parse(cleanJson)
      } catch (parseError) {
        console.error('Erreur parsing GPT response:', parseError)
        throw new Error('Invalid JSON from GPT')
      }

      console.log('✅ Estimation GPT réussie:', estimation)

      return NextResponse.json({
        success: true,
        estimation,
        source: 'GPT-4 + Prix Québec 2024',
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Erreur OpenAI:', error)
      return getFallbackEstimation(selectedRooms, selectedStyle)
    }

  } catch (error) {
    console.error('❌ Erreur dans l\'API cost-estimation:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'estimation des coûts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function getFallbackEstimation(selectedRooms: string[], selectedStyle: string) {
  console.log('📊 Using fallback cost estimation')
  
  // Estimation réaliste basée sur les prix québécois 2024
  const baseCosts = {
    'cuisine': { min: 8000, max: 18000 },      // Rénovation partielle à complète
    'salle-bain': { min: 5000, max: 12000 },   // Salle de bain standard
    'chambre': { min: 3000, max: 8000 },       // Peinture, plancher, électricité
    'salon': { min: 4000, max: 10000 },        // Peinture, plancher, éclairage  
    'bureau': { min: 2500, max: 6000 },        // Espace plus petit
    'sous-sol': { min: 6000, max: 15000 }      // Finition de sous-sol
  }

  let totalMin = 0
  let totalMax = 0

  selectedRooms.forEach(room => {
    const cost = baseCosts[room as keyof typeof baseCosts] || { min: 4000, max: 8000 }
    totalMin += cost.min
    totalMax += cost.max
  })

  // Ajustement selon le style
  const styleMultiplier = {
    'moderne': 1.2,
    'scandinave': 1.1,
    'industriel': 1.15,
    'classique': 1.3,
    'rustique': 1.0,
    'minimaliste': 0.9
  }

  const multiplier = styleMultiplier[selectedStyle as keyof typeof styleMultiplier] || 1.1
  totalMin = Math.round(totalMin * multiplier)
  totalMax = Math.round(totalMax * multiplier)

  return NextResponse.json({
    success: true,
    estimation: {
      totalMin,
      totalMax,
      currency: 'CAD',
      breakdown: [
        { category: 'Matériaux', min: Math.round(totalMin * 0.4), max: Math.round(totalMax * 0.4), details: 'Estimation basique' },
        { category: 'Main d\'œuvre', min: Math.round(totalMin * 0.45), max: Math.round(totalMax * 0.45), details: 'Taux moyen Québec' },
        { category: 'Contingence', min: Math.round(totalMin * 0.15), max: Math.round(totalMax * 0.15), details: '15% sécurité' }
      ],
      assumptions: ['Estimation approximative', 'Prix moyens 2024'],
      recommendations: ['Obtenir plusieurs soumissions', 'Prévoir 15% de contingence'],
      timeline: `${selectedRooms.length * 2}-${selectedRooms.length * 4} semaines`,
      priceDate: '2024-11'
    },
    source: 'Estimation approximative',
    timestamp: new Date().toISOString()
  })
}
