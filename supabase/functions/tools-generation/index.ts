
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
    
    const { toolId, inputs } = await req.json()
    console.log('Request data:', { toolId, inputs });

    // Use the provided API key directly
    const GEMINI_API_KEY = "AIzaSyAxpV4OY_zVDst3jGaYNwnyHhFmZ0V4XJE"
    console.log('Using hardcoded Gemini API key');

    console.log('Generating prompt...');

    let prompt = ''
    
    switch (toolId) {
      case 'script-generator':
        prompt = `Create a ${inputs.duration} video script about "${inputs.topic}" for ${inputs.platform}. 
        Tone: ${inputs.tone}
        Audience: ${inputs.audience}
        Style: ${inputs.style}
        Keywords: ${inputs.keywords || 'None'}
        Call-to-Action: ${inputs.cta || 'Subscribe and like'}
        
        Write a complete, ready-to-use script with:
        - Engaging hook/opening (first 5 seconds)
        - Clear structure with timestamps
        - Natural dialogue/narration
        - Smooth transitions between sections
        - Strong call-to-action at the end
        
        Format it professionally with clear sections and timing cues.`
        break

      case 'blog-generator':
        prompt = `Write a ${inputs.length} blog post about "${inputs.topic}".
        Tone: ${inputs.tone}
        Audience: ${inputs.audience}
        Structure: ${inputs.structure}
        SEO Keywords: ${inputs.keywords || 'None'}
        Call-to-Action: ${inputs.cta || 'None'}
        
        Create a complete blog post with:
        - Compelling headline
        - Introduction that hooks readers
        - Well-structured body with subheadings
        - Conclusion with clear CTA
        - SEO-optimized content
        
        Make it publish-ready and engaging.`
        break

      case 'reel-ideas':
        prompt = `Generate creative reel ideas for ${inputs.niche} content on ${inputs.platform}.
        Target Audience: ${inputs.audience}
        Trend Type: ${inputs.trendType}
        Content Goals: ${inputs.goals}
        Style: ${inputs.style}
        Duration: ${inputs.duration}
        
        Provide 10 specific, actionable reel ideas with:
        - Clear concept description
        - Hook/opening line
        - Visual elements needed
        - Trending audio suggestions
        - Hashtag recommendations
        
        Make each idea detailed and ready to execute.`
        break

      case 'engagement-questions':
        prompt = `Create ${inputs.quantity} engagement questions for ${inputs.contentType} about ${inputs.topic}.
        Question Type: ${inputs.questionType}
        Target Audience: ${inputs.audience}
        Goal: ${inputs.engagementGoal}
        Industry: ${inputs.industry || 'General'}
        
        Generate varied, engaging questions that:
        - Encourage responses and interaction
        - Are relevant to the audience
        - Drive the specified engagement goal
        - Are platform-appropriate
        
        Format each question clearly and provide context for use.`
        break

      case 'caption':
        prompt = `Write engaging social media captions for ${inputs.platform} about "${inputs.topic}".
        Tone: ${inputs.tone}
        Audience: ${inputs.audience}
        Call-to-Action: ${inputs.cta || 'None'}
        Keywords: ${inputs.keywords || 'None'}
        Length: ${inputs.length}
        
        Create 3 different caption variations:
        - Short and punchy version
        - Medium length with storytelling
        - Longer detailed version
        
        Include relevant emojis and formatting for each platform.`
        break

      case 'hashtag':
        prompt = `Generate ${inputs.count} hashtags for ${inputs.platform} about "${inputs.topic}".
        Niche: ${inputs.niche}
        Audience: ${inputs.audience}
        Mix Type: ${inputs.mix}
        
        Provide hashtags in these categories:
        - High-volume trending hashtags (3-5)
        - Niche-specific hashtags (5-7)
        - Long-tail hashtags (5-8)
        - Location-based (if relevant)
        
        Format them ready to copy-paste and include usage tips.`
        break

      case 'idea':
        prompt = `Generate ${inputs.quantity} content ideas for ${inputs.niche} on ${inputs.platform}.
        Content Type: ${inputs.contentType}
        Audience: ${inputs.audience}
        Goals: ${inputs.goals}
        
        Create diverse, actionable content ideas with:
        - Clear title/concept
        - Brief description
        - Content format suggestion
        - Engagement strategy
        - Posting tips
        
        Make each idea specific and ready to execute.`
        break

      case 'youtube':
        prompt = `Generate YouTube channel ideas for ${inputs.niche} niche.
        Target Audience: ${inputs.audience}
        Content Style: ${inputs.contentStyle}
        Experience Level: ${inputs.experience}
        Goals: ${inputs.goals}
        Upload Frequency: ${inputs.frequency}
        
        Provide:
        - 5 specific channel concepts
        - Content series ideas for each
        - Monetization strategies
        - Growth tactics
        - Equipment recommendations
        
        Make it comprehensive and actionable.`
        break

      case 'bio':
        prompt = `Create a compelling bio for ${inputs.platform}.
        Profession: ${inputs.profession}
        Personality: ${inputs.personality}
        Achievements: ${inputs.achievements || 'None specified'}
        Interests: ${inputs.interests || 'None specified'}
        Call-to-Action: ${inputs.cta || 'None'}
        Emoji Style: ${inputs.emojiStyle}
        
        Write 3 bio variations:
        - Professional version
        - Creative/personality-focused version
        - Balanced professional + personal version
        
        Optimize for the specific platform and include proper formatting.`
        break

      default:
        prompt = `Generate helpful content based on the user's request for ${toolId} with the following details: ${JSON.stringify(inputs)}`
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
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json()
    console.log('Gemini response received successfully');
    
    // Extract the generated content from Gemini's response structure
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated';

    return new Response(
      JSON.stringify({ content }),
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
