import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const FAL_KEY = Deno.env.get('FAL_KEY');
    if (!FAL_KEY) {
      console.error('FAL_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Generating image with prompt:', prompt);

    // Submit request to fal.ai queue
    const submitResponse = await fetch('https://queue.fal.run/bria/fibo/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Fal.ai submit error:', submitResponse.status, errorText);
      throw new Error(`Fal.ai API error: ${submitResponse.status}`);
    }

    const submitResult = await submitResponse.json();
    const requestId = submitResult.request_id;
    const responseUrl = submitResult.response_url;
    
    console.log('Request submitted, polling for result...');

    // Poll for result
    let attempts = 0;
    const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes max
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      const resultResponse = await fetch(responseUrl, {
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
        },
      });

      if (resultResponse.status === 200) {
        const result = await resultResponse.json();
        console.log("Image generated successfully");
        
        return new Response(
          JSON.stringify({ 
            images: result.images || [],
            requestId: requestId 
          }), 
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      attempts++;
    }

    throw new Error('Request timed out after 2 minutes');

  } catch (error) {
    console.error('Error in generate-image function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
