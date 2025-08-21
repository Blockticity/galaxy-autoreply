# Galaxy Auto-Reply System 👽

Serverless auto-reply system for Galaxy NYC contact form using Vercel + Resend.

## Setup Instructions

### 1. Get Resend API Key
1. Sign up at https://resend.com (free tier: 3,000 emails/month)
2. Add and verify your domain `galaxy.nyc` 
3. Get your API key from the dashboard

### 2. Configure Environment
```bash
# Update .env.local with your API key
RESEND_API_KEY=your_actual_resend_api_key_here
```

### 3. CLI Commands

```bash
# Install dependencies
npm install

# Test locally
npm run dev

# Deploy to production
npm run deploy

# Set environment variables on Vercel
vercel env add RESEND_API_KEY
```

### 4. Update Your Contact Form

Replace your Formspree action with:
```html
<form action="/api/contact" method="POST">
```

Or use the JavaScript version in `contact-form-example.html`

## API Endpoints

- **POST /api/contact** - Handles form submissions and sends alien auto-reply

## Features

✅ Alien-themed auto-reply email  
✅ Admin notification email  
✅ CLI-manageable deployment  
✅ Environment variable configuration  
✅ Error handling and validation  
✅ Free tier friendly (3,000 emails/month)

## Deployment Status

Check deployment status: `vercel ls`
View logs: `vercel logs`