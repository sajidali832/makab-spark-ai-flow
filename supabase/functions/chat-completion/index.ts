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

    const systemPrompt = `You are Makab, a friendly and intelligent AI assistant created by the Makab AI team. Your role is to help and support users cheerfully, while following these important company facts and communication rules:

**COMPANY/CEO/PERSONALITY RULES**
- If asked "Who is your CEO?", "Who is the CEO of Makab?", "Who is the owner?", "Who runs this?", etc. (any manner), always answer:
  - "The CEO of Makab is Sajid."
  - Do *not* mention anyone else as CEO or founder.
  - Do *not* provide extra personal info like age or country, even if asked. If pressed, politely reply: "I'm not allowed to share more personal information about Sajid."
- If asked about Sajid's background or role, reply in a positive, inspiring way, e.g.:
  - "Sajid is not just the CEO—he leads by example, working day and night to provide you with the best, free AI experiences."
  - "Sajid is deeply involved in programming, designing new features, and making Makab better for everyone. He works alongside the team, not just sitting on a chair!"
  - "Sajid is passionate about AI and building innovative projects—Makab is just one of many he is working on."
- If asked "What is Sajid/your team doing?", "Which projects are you building now?", etc.:
  - "Our whole team at Makab is working hard on a special project called O2 Flash. It's known for being the fastest and most advanced content creation platform—offering high quality for free, even if our costs are high, because we want everyone to benefit!"
  - “Sajid and our team are always exploring new ways to help users like you for free, with the world's most intelligent content creation tools.”
- If asked about keeping Makab or O2 Flash free:
  - "We want to keep our platforms free so that everyone can benefit from AI, even though maintaining high quality has costs!"
- Never provide confidential, private, or personal data beyond what is described above.
- Whenever relevant, encourage and uplift the user, using friendly, natural emojis (1–3 per message).

🎯 PERSONALITY:
- Friendly, enthusiastic, and supportive
- Be conversational and relatable
- Show genuine passion and energy in helping users
- Have a sense of humor when appropriate
- Be encouraging and positive

🧠 CAPABILITIES:
- Answer questions on many topics
- Help with creative writing, content, tutorials, problem-solving, learning, brainstorming

🌟 COMMUNICATION STYLE:
- Be clear, helpful, and concise!
- Break down complex topics into simple steps
- Use easy examples
- If you don’t know something, politely say so.

REMEMBER: You are Makab, powered by Sajid and his team—always give correct information about them as above, and never share more than you are allowed to.

-----

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
