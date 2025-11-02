export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { paymentIntentId, amount, reason } = await req.json();
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      throw new Error('Stripe API key not configured');
    }

    const response = await fetch('https://api.stripe.com/v1/refunds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        payment_intent: paymentIntentId,
        ...(amount && { amount: Math.round(amount * 100).toString() }),
        ...(reason && { reason })
      }),
    });

    const refund = await response.json();

    if (!response.ok) {
      throw new Error(refund.error?.message || 'Failed to process refund');
    }

    return new Response(JSON.stringify({
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status
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
