import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Debug logging
console.log('Environment check:', {
  hasKey: !!process.env.RESEND_API_KEY,
  keyLength: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Handler started, method:', req.method);
  console.log('Request body:', req.body);
  console.log('Has Resend API key:', !!process.env.RESEND_API_KEY);

  try {
    const { email, name, message } = req.body;

    // Validate required fields
    if (!email || !name || !message) {
      console.log('Missing fields:', { email: !!email, name: !!name, message: !!message });
      return res.status(400).json({ 
        error: 'Missing required fields: email, name, message' 
      });
    }

    console.log('Attempting to send auto-reply to:', email);
    console.log('Resend instance created successfully');
    
    // Send alien auto-reply (will work once domain is verified)
    let autoReplyResult = null;
    try {
      autoReplyResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: '👽 Transmission Received - [CLASSIFIED]',
      html: `
        <div style="
          font-family: 'Courier New', monospace; 
          background: #000; 
          color: #00ff00; 
          padding: 20px; 
          border: 2px solid #00ff00;
          max-width: 600px;
          margin: 0 auto;
        ">
          <h2 style="color: #00ff00; text-align: center; margin-bottom: 20px;">
            👽 Shhh… you're in. 🤫
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
            Updates will arrive via encrypted transmissions.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Don't tell the humans. 👽
          </p>
          
          <hr style="border: 1px solid #00ff00; margin: 20px 0;">
          
          <div style="text-align: center; font-size: 12px; color: #00ff00;">
            <strong>GALAXY NYC</strong><br>
            [CLASSIFIED TRANSMISSION]<br>
            TRANSMISSION ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9)}
          </div>
        </div>
      `,
      });
      
      console.log('Auto-reply result:', autoReplyResult);
    } catch (emailError) {
      console.log('Auto-reply failed (expected until domain verified):', emailError.message);
      autoReplyResult = { error: 'Domain not verified yet' };
    }

    // Send notification to you (optional)
    const notificationResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ian@blockticity.io', // your verified email
      subject: `New Contact: ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Auto-reply status: ${autoReplyResult?.error ? '❌ Failed (domain not verified)' : '✅ Sent successfully'}</em></p>
      `,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Transmission successful. The humans remain unaware. 👽'
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
      error: 'Transmission failed. Please try again.',
      details: error.message || 'Unknown error'
    });
  }
}