
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surveyData } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Analyze the survey data with OpenAI
    const analysisPrompt = `
You are a maritime survey analysis expert. Analyze this survey data and provide actionable insights in JSON format.

Survey Data: ${JSON.stringify(surveyData, null, 2)}

Provide analysis in this exact JSON structure:
{
  "summary": "Brief overall assessment",
  "insights": [
    {
      "type": "warning" | "info" | "success" | "critical",
      "title": "Brief title",
      "description": "Detailed description",
      "category": "checklist" | "estimator" | "priority" | "travel" | "media" | "general"
    }
  ],
  "completeness": {
    "checklist": 0-100,
    "estimator": 0-100,
    "priority": 0-100,
    "travel": 0-100,
    "media": 0-100
  },
  "recommendations": [
    "Specific actionable recommendation"
  ],
  "readyForExport": boolean
}

Focus on:
- Missing data or incomplete sections
- Zones without media documentation
- Estimator items lacking dimensions/quantities
- Priority review status
- Travel time completeness
- Overall survey quality and completeness
`;

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
            content: 'You are a maritime survey analysis expert. Always respond with valid JSON matching the requested structure.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in survey-ai-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
