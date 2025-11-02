export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { period, earnings, expenses } = await req.json();
    
    const html = `<!DOCTYPE html>
<html><head><style>
body { font-family: Arial, sans-serif; padding: 40px; }
h1 { color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
.summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 30px 0; }
.card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
.card h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
.card .value { font-size: 32px; font-weight: bold; color: #333; }
</style></head><body>
<h1>Financial Report - ${period}</h1>
<p>Generated: ${new Date().toLocaleDateString()}</p>
<div class="summary">
  <div class="card"><h3>Total Earnings</h3><div class="value">$${earnings.total.toFixed(2)}</div><p>${earnings.bookings} bookings</p></div>
  <div class="card"><h3>Total Expenses</h3><div class="value">$${expenses.total.toFixed(2)}</div><p>${expenses.count} expenses</p></div>
  <div class="card"><h3>Net Income</h3><div class="value">$${(earnings.total - expenses.total).toFixed(2)}</div><p>After expenses</p></div>
</div></body></html>`;

    return new Response(JSON.stringify({ html, url: `data:text/html;base64,${btoa(html)}` }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
