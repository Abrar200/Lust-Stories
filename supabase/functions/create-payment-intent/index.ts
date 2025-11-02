export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'usd', paymentType, description, metadata } = await req.json();
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      throw new Error('Stripe API key not configured');
    }

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency,
        'metadata[payment_type]': paymentType,
        'metadata[description]': description || '',
        ...Object.entries(metadata || {}).reduce((acc, [key, value]) => {
          acc[`metadata[${key}]`] = String(value);
          return acc;
        }, {} as Record<string, string>)
      }),
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      throw new Error(paymentIntent.error?.message || 'Failed to create payment intent');
    }

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
