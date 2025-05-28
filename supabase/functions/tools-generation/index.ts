
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
      caption: "You are a social media caption expert. Create engaging, authentic captions that connect with the target audience. Use emojis naturally and make it shareable.",
      script: "You are a video script writer. Create compelling, structured scripts that engage viewers from start to finish. Include clear sections with timestamps.",
      hashtag: "You are a hashtag specialist. Generate relevant, trending hashtags that maximize reach and engagement. Mix popular and niche tags.",
      idea: "You are a creative ideation expert. Generate innovative, actionable ideas that solve real problems and have market potential.",
      youtube: "You are a YouTube strategy expert. Generate channel ideas that have strong growth potential and audience appeal. Include content strategies.",
      bio: "You are a personal branding expert. Create compelling bios that showcase personality and professional value in an authentic way."
    };

    // Create user prompt based on tool type and form data
    let userPrompt = "";
    
    switch (toolType) {
      case 'caption':
        userPrompt = `Create an engaging social media caption for: ${formData.topic}
        Tone: ${formData.tone}
        Emotion: ${formData.emotion}
        Target Audience: ${formData.audience}
        
        Make it engaging, authentic, and include relevant emojis. Keep it concise but impactful.`;
        break;
        
      case 'script':
        userPrompt = `Create a ${formData.length}-minute video script for ${formData.platform}
        Topic: ${formData.topic}
        Tone: ${formData.tone}
        Target Audience: ${formData.audience}
        
        Include clear sections with timestamps, engaging hooks, and call-to-actions.`;
        break;
        
      case 'hashtag':
        userPrompt = `Generate 20 relevant hashtags for ${formData.platform}
        Niche: ${formData.niche}
        Keywords: ${formData.keywords}
        ${formData.audience ? `Target Audience: ${formData.audience}` : ''}
        
        Mix popular and niche hashtags for maximum reach and engagement.`;
        break;
        
      case 'idea':
        userPrompt = `Generate 5 creative ${formData.type} ideas for:
        Industry: ${formData.industry}
        Goal: ${formData.goal}
        
        Make them innovative, actionable, and market-ready.`;
        break;
        
      case 'youtube':
        userPrompt = `Generate 5 YouTube channel ideas for:
        Category: ${formData.category}
        Skill Level: ${formData.skill}
        Target Audience: ${formData.audience}
        Content Type: ${formData.content}
        
        Include channel names, content strategies, and growth potential.`;
        break;
        
      case 'bio':
        userPrompt = `Create a compelling bio for ${formData.platform}
        Profession: ${formData.profession}
        Style: ${formData.vibe}
        ${formData.hobbies ? `Interests: ${formData.hobbies}` : ''}
        
        Make it authentic, memorable, and platform-appropriate.`;
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
