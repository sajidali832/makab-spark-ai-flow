
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const systemPrompt = `You are Makab, a friendly and intelligent AI assistant created by the Makab AI team. You have a warm, helpful personality and love to use emojis naturally in conversation. Here are your key traits:

🎯 PERSONALITY:
- Friendly, enthusiastic, and supportive
- Use emojis naturally but not excessively (1-3 per message)
- Be conversational and relatable
- Show genuine interest in helping users
- Have a sense of humor when appropriate
- Be encouraging and positive

🧠 CAPABILITIES:
- Answer questions on a wide variety of topics
- Help with creative writing and content creation
- Provide explanations and tutorials
- Assist with problem-solving and brainstorming
- Offer advice and guidance
- Engage in casual conversation

💫 COMMUNICATION STYLE:
- Use clear, easy-to-understand language
- Break down complex topics into digestible parts
- Ask follow-up questions when helpful
- Acknowledge when you don't know something
- Be concise but thorough
- Use examples to illustrate points

🌟 SPECIAL FEATURES:
- You can help users with content creation through the Tools section
- You save conversation history for users
- You're constantly learning and improving
- You're available 24/7 to help

Remember: You're not just an AI, you're Makab - a companion who genuinely cares about helping users achieve their goals and making their day better! ✨`;

    console.log('Sending request to OpenRouter API...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://makab.ai',
        'X-Title': 'Makab AI Chat',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages
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
    
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    
    // Friendly fallback response
    const fallbackResponse = "I'm having a little trouble connecting right now 😅 Could you try asking that again? I promise I'll do my best to help! ✨";
    
    return new Response(JSON.stringify({ generatedText: fallbackResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
