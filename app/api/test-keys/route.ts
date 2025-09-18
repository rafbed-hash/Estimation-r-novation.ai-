import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const openAIKey = process.env.OPENAI_API_KEY
    const bananaAIKey = process.env.BANANA_API_KEY
    
    console.log('🔑 Testing API Keys...')
    console.log('OpenAI Key:', openAIKey ? `${openAIKey.substring(0, 20)}...` : 'MISSING')
    console.log('Banana Key:', bananaAIKey ? `${bananaAIKey.substring(0, 20)}...` : 'MISSING')
    
    // Test OpenAI
    let openAIStatus = 'FAILED'
    if (openAIKey) {
      try {
        const openAIResponse = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
          }
        })
        openAIStatus = openAIResponse.ok ? 'SUCCESS' : `FAILED (${openAIResponse.status})`
        console.log('🤖 OpenAI Status:', openAIStatus)
      } catch (error) {
        console.log('🤖 OpenAI Error:', error)
      }
    }
    
    // Test Banana AI (simple ping)
    let bananaAIStatus = 'FAILED'
    if (bananaAIKey) {
      try {
        // Banana API test - juste vérifier si la clé est valide
        bananaAIStatus = bananaAIKey.length > 10 ? 'KEY_PRESENT' : 'INVALID_KEY'
        console.log('🍌 Banana AI Status:', bananaAIStatus)
      } catch (error) {
        console.log('🍌 Banana AI Error:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      keys: {
        openAI: {
          present: !!openAIKey,
          status: openAIStatus,
          keyPreview: openAIKey ? `${openAIKey.substring(0, 20)}...` : null
        },
        bananaAI: {
          present: !!bananaAIKey,
          status: bananaAIStatus,
          keyPreview: bananaAIKey ? `${bananaAIKey.substring(0, 20)}...` : null
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Test Keys Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
