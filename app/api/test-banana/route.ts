import { NextRequest, NextResponse } from 'next/server'
import { GoogleAIStudioService } from '@/lib/services/google-ai-studio'

export async function GET() {
  try {
    console.log('🧪 Testing Google AI Studio API...')
    
    // Check environment variables
    const nanoBananaKey = process.env.GOOGLE_AI_API_KEY || process.env.NANO_BANANA_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY
    
    console.log('🔑 Environment variables check:')
    console.log('- GOOGLE_AI_API_KEY:', !!process.env.GOOGLE_AI_API_KEY)
    console.log('- NANO_BANANA_API_KEY:', !!process.env.NANO_BANANA_API_KEY)
    console.log('- Selected key:', !!nanoBananaKey)
    
    if (!nanoBananaKey) {
      return NextResponse.json({
        success: false,
        error: 'Google AI Studio API key not found',
        details: {
          GOOGLE_AI_API_KEY: !!process.env.GOOGLE_AI_API_KEY,
          NANO_BANANA_API_KEY: !!process.env.NANO_BANANA_API_KEY,
          message: 'Please set GOOGLE_AI_API_KEY or NANO_BANANA_API_KEY in your environment variables'
        }
      }, { status: 500 })
    }

    // Initialize Google AI Studio service
    const googleAI = new GoogleAIStudioService(nanoBananaKey)
    
    // Test API key validation
    console.log('🔑 Testing Google AI Studio API key validation...')
    const isValidKey = await googleAI.validateApiKey()
    
    if (!isValidKey) {
      return NextResponse.json({
        success: false,
        error: 'Invalid Google AI Studio API key',
        details: {
          keyPresent: true,
          keyValid: false,
          message: 'The API key is present but not valid. Please check your Gemini API key.'
        }
      }, { status: 401 })
    }

    // Test with a simple text-only request (no image)
    console.log('🎨 Testing Google AI Studio text analysis...')
    
    try {
      const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': nanoBananaKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Test: Describe a modern kitchen renovation in 50 words."
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          }
        })
      })

      if (!testResponse.ok) {
        const errorText = await testResponse.text()
        console.error('❌ Google AI Studio API Error:', testResponse.status, errorText)
        
        return NextResponse.json({
          success: false,
          error: 'Google AI Studio API request failed',
          details: {
            status: testResponse.status,
            statusText: testResponse.statusText,
            response: errorText,
            message: 'The API key is valid but the request failed. Check API quotas and permissions.'
          }
        }, { status: testResponse.status })
      }

      const testResult = await testResponse.json()
      const generatedText = testResult.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'

      console.log('✅ Google AI Studio test successful!')
      console.log('📝 Generated text:', generatedText)

      return NextResponse.json({
        success: true,
        message: 'Google AI Studio is working correctly!',
        details: {
          apiKeyValid: true,
          model: 'gemini-2.5-flash',
          testResponse: generatedText,
          timestamp: new Date().toISOString()
        }
      })

    } catch (apiError) {
      console.error('❌ Google AI Studio API call failed:', apiError)
      
      return NextResponse.json({
        success: false,
        error: 'Google AI Studio API call failed',
        details: {
          keyValid: true,
          apiCallFailed: true,
          error: apiError instanceof Error ? apiError.message : 'Unknown error',
          message: 'API key is valid but the service call failed. This might be a temporary issue.'
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🧪 Testing Google AI Studio with image analysis...')
    
    const nanoBananaKey = process.env.GOOGLE_AI_API_KEY || process.env.NANO_BANANA_API_KEY
    
    if (!nanoBananaKey) {
      return NextResponse.json({
        success: false,
        error: 'Google AI Studio API key not found'
      }, { status: 500 })
    }

    if (!body.image) {
      return NextResponse.json({
        success: false,
        error: 'No image provided for testing'
      }, { status: 400 })
    }

    const nanoBanana = new GoogleAIStudioService(nanoBananaKey)
    
    // Test image transformation
    const result = await nanoBanana.transformImage({
      originalPhoto: body.image,
      roomType: body.roomType || 'salle-de-bain',
      selectedStyle: body.style || 'moderne',
      customPrompt: 'Test transformation'
    })

    return NextResponse.json({
      success: true,
      message: 'Google AI Studio image analysis completed!',
      result: {
        confidence: result.confidence,
        processingTime: result.processingTime,
        description: result.description.substring(0, 200) + '...',
        model: 'gemini-2.5-flash'
      }
    })

  } catch (error) {
    console.error('❌ Image test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Image test failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}
