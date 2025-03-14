
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

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
    const { operation, num1, num2 } = await req.json();

    if (!operation || num1 === undefined || num2 === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Getting help for ${num1} ${operation} ${num2}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful elementary math tutor. Provide simple, clear explanations with visual examples when possible. Keep responses under 200 words and appropriate for young students.'
          },
          { 
            role: 'user', 
            content: `Please help explain how to solve ${num1} ${operation === 'addition' ? '+' : operation === 'subtraction' ? '-' : operation === 'multiplication' ? '×' : '÷'} ${num2}. Give 2-3 strategies that could help, using simple language.`
          }
        ],
        temperature: 0.7,
        max_tokens: 350,
      }),
    });

    const data = await response.json();
    console.log("OpenAI response received");

    if (data.error) {
      throw new Error(data.error.message || "Error from OpenAI API");
    }

    const explanation = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ explanation }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in get-question-help function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while processing your request" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
