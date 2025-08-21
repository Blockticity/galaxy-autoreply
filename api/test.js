export default async function handler(req, res) {
  console.log('=== TEST HANDLER START ===');
  console.log('Method:', req.method);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Environment check:', {
    hasResendKey: !!process.env.RESEND_API_KEY,
    keyLength: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0,
    nodeEnv: process.env.NODE_ENV
  });

  try {
    const { Resend } = await import('resend');
    console.log('Resend imported successfully');
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend instance created');

    if (req.method === 'POST') {
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<h1>Test</h1>'
      });
      
      console.log('Email result:', result);
      
      return res.json({ 
        success: true, 
        result: result,
        timestamp: new Date().toISOString()
      });
    }

    return res.json({ 
      message: 'GET request received', 
      timestamp: new Date().toISOString() 
    });

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}