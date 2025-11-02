export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { content, contentType, userId, referenceId } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Call OpenAI Moderation API
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Moderation service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const moderationResponse = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({ input: content })
    });

    if (!moderationResponse.ok) {
      throw new Error('OpenAI moderation API failed');
    }

    const moderationResult = await moderationResponse.json();
    const result = moderationResult.results[0];

    const flagged = result.flagged;
    const categories = result.categories;
    const scores = result.category_scores;

    let highestCategory = '';
    let highestScore = 0;
    for (const [category, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        highestCategory = category;
      }
    }

    // Create flag if confidence above 0.7
    if (flagged && highestScore > 0.7) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (supabaseUrl && supabaseKey) {
        const flagReason = Object.entries(categories)
          .filter(([_, value]) => value === true)
          .map(([key]) => key)
          .join(', ');

        await fetch(`${supabaseUrl}/rest/v1/content_flags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            content_type: contentType,
            content_id: referenceId,
            user_id: userId,
            flag_reason: flagReason,
            flag_type: 'automated',
            severity: highestScore > 0.9 ? 'high' : 'medium',
            ai_confidence: highestScore,
            status: 'pending'
          })
        });
      }
    }

    return new Response(
      JSON.stringify({
        flagged,
        categories,
        highestCategory,
        confidence: highestScore,
        shouldBlock: flagged && highestScore > 0.9
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Moderation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
