
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
        prompt = `Create a complete ${inputs.duration} video script about "${inputs.topic}" for ${inputs.platform}. 
        Tone: ${inputs.tone}
        Audience: ${inputs.audience}
        Style: ${inputs.style}
        Keywords: ${inputs.keywords || 'None'}
        Call-to-Action: ${inputs.cta || 'Subscribe and like'}
        
        Generate ONLY the complete script with:
        - Hook/opening (0-5 seconds)
        - Main content with clear structure
        - Natural dialogue/narration
        - Smooth transitions
        - Strong ending with CTA
        
        Format with timestamps. No explanations, just the ready-to-use script.`
        break

      case 'blog-generator':
        prompt = `Write a complete ${inputs.length} blog post about "${inputs.topic}".
        Tone: ${inputs.tone}
        Audience: ${inputs.audience}
        Structure: ${inputs.structure}
        SEO Keywords: ${inputs.keywords || 'None'}
        Call-to-Action: ${inputs.cta || 'None'}
        
        Generate ONLY the complete blog post with:
        - Compelling headline
        - Introduction
        - Well-structured body with subheadings
        - Conclusion with CTA
        
        No explanations, just the ready-to-publish blog post.`
        break

      case 'reel-ideas':
        prompt = `Generate 10 specific reel ideas for ${inputs.niche} content on ${inputs.platform}.
        Target Audience: ${inputs.audience}
        Trend Type: ${inputs.trendType}
        Content Goals: ${inputs.goals}
        Style: ${inputs.style}
        Duration: ${inputs.duration}
        
        For each idea provide ONLY:
        1. Clear concept title
        2. Hook/opening line
        3. Visual elements needed
        4. Trending audio suggestion
        5. 5 relevant hashtags
        
        No explanations, just the 10 ready-to-execute ideas.`
        break

      case 'engagement-questions':
        prompt = `Create ${inputs.quantity} ${inputs.questionType} engagement questions for ${inputs.contentType} about ${inputs.topic}.
        Target Audience: ${inputs.audience}
        Goal: ${inputs.engagementGoal}
        Industry: ${inputs.industry || 'General'}
        
        Generate ONLY the questions that:
        - Encourage responses and interaction
        - Are relevant to the audience
        - Drive the specified engagement goal
        
        No explanations, just the ready-to-use questions.`
        break

      case 'caption':
        prompt = `Write 3 engaging social media captions for ${inputs.platform} about "${inputs.topic}".
        Tone: ${inputs.tone}
        Audience: ${inputs.audience}
        Call-to-Action: ${inputs.cta || 'None'}
        Keywords: ${inputs.keywords || 'None'}
        Length: ${inputs.length}
        
        Generate ONLY:
        1. Short and punchy version
        2. Medium length with storytelling
        3. Longer detailed version
        
        Include relevant emojis. No explanations, just the ready-to-use captions.`
        break

      case 'hashtag':
        prompt = `Generate ${inputs.count} hashtags for ${inputs.platform} about "${inputs.topic}".
        Niche: ${inputs.niche}
        Audience: ${inputs.audience}
        Mix Type: ${inputs.mix}
        
        Provide ONLY hashtags in these categories:
        - High-volume trending hashtags (3-5)
        - Niche-specific hashtags (5-7) 
        - Long-tail hashtags (5-8)
        - Location-based (if relevant)
        
        Format: One hashtag per line starting with #. No explanations.`
        break

      case 'idea':
        prompt = `Generate ${inputs.quantity} content ideas for ${inputs.niche} on ${inputs.platform}.
        Content Type: ${inputs.contentType}
        Audience: ${inputs.audience}
        Goals: ${inputs.goals}
        
        For each idea provide ONLY:
        1. Clear title/concept
        2. Brief description (1-2 sentences)
        3. Content format suggestion
        4. Engagement strategy
        
        No explanations, just the ready-to-execute ideas.`
        break

      case 'youtube':
        prompt = `Generate YouTube channel strategy for ${inputs.niche} niche.
        Target Audience: ${inputs.audience}
        Content Style: ${inputs.contentStyle}
        Experience Level: ${inputs.experience}
        Goals: ${inputs.goals}
        Upload Frequency: ${inputs.frequency}
        
        Provide ONLY:
        - 5 specific channel concepts
        - 10 video series ideas
        - Monetization strategies
        - Growth tactics
        - Equipment recommendations
        
        No explanations, just the actionable strategy.`
        break

      case 'bio':
        prompt = `Create 3 compelling bios for ${inputs.platform}.
        Profession: ${inputs.profession}
        Personality: ${inputs.personality}
        Achievements: ${inputs.achievements || 'None specified'}
        Interests: ${inputs.interests || 'None specified'}
        Call-to-Action: ${inputs.cta || 'None'}
        Emoji Style: ${inputs.emojiStyle}
        
        Generate ONLY:
        1. Professional version
        2. Creative/personality-focused version  
        3. Balanced professional + personal version
        
        No explanations, just the ready-to-use bios.`
        break

      case 'email-subject':
        prompt = `Create ${inputs.quantity} compelling email subject lines for ${inputs.emailType} emails about "${inputs.topic}".
        Target Audience: ${inputs.audience}
        Tone: ${inputs.tone}
        Primary Goal: ${inputs.goal}
        Keywords: ${inputs.keywords || 'None'}
        
        Generate ONLY subject lines that:
        - Are under 50 characters when possible
        - Create urgency or curiosity
        - Are relevant to the audience
        - Drive the specified goal
        
        Format: One subject line per line. No explanations.`
        break

      case 'thread-generator':
        prompt = `Create a ${inputs.threadLength} thread for ${inputs.platform} about "${inputs.topic}".
        Purpose: ${inputs.purpose}
        Tone: ${inputs.tone}
        Audience: ${inputs.audience}
        Call-to-Action: ${inputs.cta}
        
        Generate ONLY the complete thread with:
        - Strong opening tweet/post
        - Logical flow between posts
        - Engaging content in each post
        - Clear numbering (1/X format)
        - Strong closing with CTA
        
        Format each post clearly. No explanations, just the ready-to-post thread.`
        break

      case 'linkedin-post':
        prompt = `Write a ${inputs.length} LinkedIn post about "${inputs.topic}".
        Post Type: ${inputs.postType}
        Tone: ${inputs.tone}
        Industry: ${inputs.industry}
        Target Audience: ${inputs.audience}
        Call-to-Action: ${inputs.cta}
        
        Generate ONLY a complete LinkedIn post with:
        - Attention-grabbing opening
        - Professional insights or value
        - Personal touch when appropriate
        - Clear structure with line breaks
        - Strong call-to-action
        
        No explanations, just the ready-to-publish post.`
        break

      case 'image-prompt':
        prompt = `Create a detailed AI image generation prompt based on:
        Subject: ${inputs.subject}
        Art Style: ${inputs.style}
        Mood: ${inputs.mood}
        Setting: ${inputs.setting}
        Colors: ${inputs.colors}
        Camera Angle: ${inputs.perspective}
        Additional Details: ${inputs.details || 'None'}
        
        Generate ONLY a comprehensive, detailed prompt that includes:
        - Clear subject description
        - Specific art style instructions
        - Mood and atmosphere details
        - Setting and background elements
        - Color palette specifications
        - Camera angle and composition
        - Technical quality keywords
        
        Format as a single, detailed prompt ready for AI image generation. No explanations.`
        break

      case 'seo-title':
        prompt = `Generate ${inputs.quantity} SEO-optimized titles for ${inputs.contentType} about "${inputs.topic}".
        Primary Keywords: ${inputs.keywords}
        Target Audience: ${inputs.audience}
        Search Intent: ${inputs.intent}
        Title Style: ${inputs.titleStyle}
        
        Create titles that:
        - Include primary keywords naturally
        - Are 50-60 characters when possible
        - Match the search intent
        - Appeal to the target audience
        - Follow the specified style
        - Are click-worthy and descriptive
        
        Format: One title per line. No explanations, just SEO-optimized titles.`
        break

      default:
        prompt = `Generate helpful content for ${toolId} with details: ${JSON.stringify(inputs)}. Provide only the requested content without explanations.`
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
                text: `You are a professional content creator. Generate high-quality, actionable content that users can immediately use. Be specific and creative. IMPORTANT: Generate ONLY the requested content without any explanations, introductions, or meta-commentary. Users want ready-to-use content, not explanations about what you can do. Here is the request: ${prompt}`
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
