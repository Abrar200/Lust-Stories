export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { bookingId, reminderType, recipientType } = await req.json();

    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const sendgridKey = Deno.env.get('SENDGRID_API_KEY');

    // Fetch booking details from database
    // const booking = await fetchBookingDetails(bookingId);

    let smsMessage = '';
    let emailSubject = '';

    if (reminderType === '24_hours') {
      smsMessage = `Reminder: You have a booking tomorrow. Check the app for details.`;
      emailSubject = 'Booking Reminder - Tomorrow';
    } else if (reminderType === '2_hours') {
      smsMessage = `Reminder: Your booking starts in 2 hours. See you soon!`;
      emailSubject = 'Booking Starting Soon';
    } else {
      smsMessage = `Your booking is starting now!`;
      emailSubject = 'Booking Starting Now';
    }

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
    const twilioAuth = btoa(`${twilioSid}:${twilioToken}`);
    
    await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${twilioAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: '+61400000000',
        From: '+61400000001',
        Body: smsMessage
      })
    });

    // Send Email via SendGrid
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'user@example.com' }] }],
        from: { email: 'noreply@app.com' },
        subject: emailSubject,
        content: [{ type: 'text/html', value: `<p>${smsMessage}</p>` }]
      })
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
