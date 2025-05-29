
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toolType, formData } = await req.json();

    // Create system prompt based on tool type
    const systemPrompts = {
      caption: "Generate only the social media caption. No explanations, no introductions, no descriptions. Just the caption text with emojis.",
      script: "Generate only the video script content. No explanations, no introductions. Just the script with clear sections and timestamps.",
      hashtag: "Generate only hashtags. No explanations, no text, no descriptions. Just hashtags, one per line.",
      idea: "Generate only the ideas. No explanations, no introductions. Just the ideas in a clean list format.",
      youtube: "Generate only the YouTube channel ideas. No explanations, no introductions. Just the channel ideas with names and brief descriptions.",
      bio: "Generate only the bio text. No explanations, no introductions, no descriptions. Just the bio content."
    };

    // Create user prompt based on tool type and form data
    let userPrompt = "";
    
    switch (toolType) {
      case 'caption':
        userPrompt = `Create a ${formData.tone} ${formData.emotion} social media caption for: ${formData.topic}
        Target Audience: ${formData.audience}`;
        break;
        
      case 'script':
        userPrompt = `Create a ${formData.length} video script for ${formData.platform}
        Topic: ${formData.topic}
        Tone: ${formData.tone}
        Target Audience: ${formData.audience}`;
        break;
        
      case 'hashtag':
        userPrompt = `Generate 20 hashtags for ${formData.platform}
        Niche: ${formData.niche}
        Keywords: ${formData.keywords}
        ${formData.audience ? `Target Audience: ${formData.audience}` : ''}`;
        break;
        
      case 'idea':
        userPrompt = `Generate 5 ${formData.type} ideas for:
        Industry: ${formData.industry}
        Goal: ${formData.goal}`;
        break;
        
      case 'youtube':
        userPrompt = `Generate 5 YouTube channel ideas for:
        Category: ${formData.category}
        Skill Level: ${formData.skill}
        Target Audience: ${formData.audience}
        Content Type: ${formData.content}`;
        break;
        
      case 'bio':
        userPrompt = `Create a bio for ${formData.platform}
        Profession: ${formData.profession}
        Style: ${formData.vibe}
        ${formData.hobbies ? `Interests: ${formData.hobbies}` : ''}`;
        break;
    }

    console.log('Making request to OpenRouter with model: google/gemma-3-27b-it:free');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://makab.ai',
        'X-Title': 'Makab AI Tools',
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [
          {
            role: 'system',
            content: systemPrompts[toolType as keyof typeof systemPrompts]
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received successfully');
    
    const generatedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tools-generation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
