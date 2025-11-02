export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { period } = await req.json();
    
    // Generate CSV content (can be opened in Excel)
    const csv = `Financial Report - ${period}
Generated: ${new Date().toLocaleDateString()}

Category,Amount,Date,Description
Earnings,$5000.00,${new Date().toLocaleDateString()},Completed bookings
Expenses,$1200.00,${new Date().toLocaleDateString()},Business expenses
Net Income,$3800.00,${new Date().toLocaleDateString()},After expenses`;

    const blob = btoa(csv);
    
    return new Response(JSON.stringify({ 
      csv,
      url: `data:text/csv;base64,${blob}`,
      filename: `financial-report-${period}-${Date.now()}.csv`
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
