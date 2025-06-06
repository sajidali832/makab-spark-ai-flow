import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Tools generation function called');
    
    const { toolType, inputData } = await req.json()
    console.log('Request data:', { toolType, inputData });

    // Use the provided API key directly
    const GEMINI_API_KEY = "AIzaSyAxpV4OY_zVDst3jGaYNwnyHhFmZ0V4XJE"
    console.log('Using hardcoded Gemini API key');

    console.log('Generating prompt...');

    let prompt = ''
    
    switch (toolType) {
      case 'script-generator':
        prompt = `Create a ${inputData.duration} video script about "${inputData.topic}" for ${inputData.platform}. 
        Tone: ${inputData.tone}
        Audience: ${inputData.audience}
        Style: ${inputData.style}
        Keywords: ${inputData.keywords || 'None'}
        
        Write a complete, ready-to-use script with:
        - Engaging hook/opening
        - Clear structure with timestamps
        - Natural dialogue/narration
        - Call-to-action at the end
        
        Format it professionally with clear sections and timing cues.`
        break

      case 'blog-generator':
        prompt = `Write a ${inputData.length} blog post about "${inputData.topic}".
        Tone: ${inputData.tone}
        Audience: ${inputData.audience}
        Structure: ${inputData.structure}
        SEO Keywords: ${inputData.keywords || 'None'}
        Call-to-Action: ${inputData.cta || 'None'}
        
        Create a complete blog post with:
        - Compelling headline
        - Introduction that hooks readers
        - Well-structured body with subheadings
        - Conclusion with clear CTA
        - SEO-optimized content
        
        Make it publish-ready and engaging.`
        break

      case 'reel-ideas':
        prompt = `Generate creative reel ideas for ${inputData.niche} content on ${inputData.platform}.
        Target Audience: ${inputData.audience}
        Trend Type: ${inputData.trend_type}
        Content Goals: ${inputData.goals}
        Style: ${inputData.style}
        Duration: ${inputData.duration}
        
        Provide 10 specific, actionable reel ideas with:
        - Clear concept description
        - Hook/opening line
        - Visual elements needed
        - Trending audio suggestions
        - Hashtag recommendations
        
        Make each idea detailed and ready to execute.`
        break

      case 'engagement-questions':
        prompt = `Create ${inputData.quantity} engagement questions for ${inputData.content_type} about ${inputData.topic}.
        Question Type: ${inputData.question_type}
        Target Audience: ${inputData.audience}
        Goal: ${inputData.engagement_goal}
        Industry: ${inputData.industry || 'General'}
        
        Generate varied, engaging questions that:
        - Encourage responses and interaction
        - Are relevant to the audience
        - Drive the specified engagement goal
        - Are platform-appropriate
        
        Format each question clearly and provide context for use.`
        break

      case 'caption':
        prompt = `Write engaging social media captions for ${inputData.platform} about "${inputData.topic}".
        Tone: ${inputData.tone}
        Audience: ${inputData.audience}
        Call-to-Action: ${inputData.cta || 'None'}
        Keywords: ${inputData.keywords || 'None'}
        
        Create 3 different caption variations:
        - Short and punchy version
        - Medium length with storytelling
        - Longer detailed version
        
        Include relevant emojis and formatting for each platform.`
        break

      case 'hashtag':
        prompt = `Generate ${inputData.count} for ${inputData.platform} about "${inputData.topic}".
        Niche: ${inputData.niche}
        Audience: ${inputData.audience}
        Mix Type: ${inputData.mix}
        
        Provide hashtags in these categories:
        - High-volume trending hashtags
        - Niche-specific hashtags
        - Long-tail hashtags
        - Location-based (if relevant)
        
        Format them ready to copy-paste and include usage tips.`
        break

      case 'idea':
        prompt = `Generate ${inputData.quantity} content ideas for ${inputData.niche} on ${inputData.platform}.
        Content Type: ${inputData.content_type}
        Audience: ${inputData.audience}
        Goals: ${inputData.goals}
        
        Create diverse, actionable content ideas with:
        - Clear title/concept
        - Brief description
        - Content format suggestion
        - Engagement strategy
        - Posting tips
        
        Make each idea specific and ready to execute.`
        break

      case 'youtube':
        prompt = `Generate YouTube channel ideas for ${inputData.niche} niche.
        Target Audience: ${inputData.audience}
        Content Style: ${inputData.content_style}
        Experience Level: ${inputData.experience}
        Goals: ${inputData.goals}
        Upload Frequency: ${inputData.frequency}
        
        Provide:
        - 5 specific channel concepts
        - Content series ideas for each
        - Monetization strategies
        - Growth tactics
        - Equipment recommendations
        
        Make it comprehensive and actionable.`
        break

      case 'bio':
        prompt = `Create a compelling bio for ${inputData.platform}.
        Profession: ${inputData.profession}
        Personality: ${inputData.personality}
        Achievements: ${inputData.achievements || 'None specified'}
        Interests: ${inputData.interests || 'None specified'}
        Call-to-Action: ${inputData.cta || 'None'}
        Emoji Style: ${inputData.emoji_style}
        
        Write 3 bio variations:
        - Professional version
        - Creative/personality-focused version
        - Balanced professional + personal version
        
        Optimize for the specific platform and include proper formatting.`
        break

      default:
        prompt = `Generate helpful content based on the user's request for ${toolType} with the following details: ${JSON.stringify(inputData)}`
    }

    console.log('Sending request to Gemini API...');

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a professional content creator and marketing expert. Generate high-quality, actionable content that users can immediately use. Be specific, creative, and provide value. Do not explain what you can do - just deliver the requested content directly. Format everything clearly and professionally. Here is the request: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      }),
    })

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      // Create more user-friendly error messages based on common API errors
      if (response.status === 400) {
        throw new Error('Invalid request: Please check your input and try again')
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication error: The Gemini API key appears to be invalid')
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded: Too many requests to the Gemini API')
      } else if (response.status === 500) {
        throw new Error('Gemini service error: Their servers may be experiencing issues')
      } else {
        throw new Error(`Gemini API error: ${response.status} - Please check the function logs for details`)
      }
    }

    const data = await response.json()
    console.log('Gemini response received successfully');
    
    // Extract the generated content from Gemini's response structure
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated';

    return new Response(
      JSON.stringify({ generatedContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in tools-generation function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: 'Please check the console logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
