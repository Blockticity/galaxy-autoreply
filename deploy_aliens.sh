#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "👽 Welcome. We're about to:"
echo "  1) Verify Vercel CLI and log you in"
echo "  2) Link or init your project"
echo "  3) Capture Resend settings and add env vars on Vercel (production)"
echo "  4) Deploy to production"
echo "  5) Test the /api/contact endpoint with a live send"
echo ""

# 0) Ensure vercel CLI is present
if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Installing globally with npm..."
  npm i -g vercel
fi

echo ""
echo "Step 1 — Vercel login. A browser window may open."
read -p "Press Enter to start login... "
vercel login

echo ""
echo "Step 2 — Initialize or link project."
echo "If prompted, choose your scope, project name, and framework."
echo "If this is the first deploy, answer 'No' to 'Link to existing project?' and follow prompts."
read -p "Press Enter to run 'vercel'... "
vercel

echo ""
echo "Step 3 — Resend configuration."
echo "If you have not already, verify your domain in Resend dashboard for better deliverability."
echo "You can use a Resend test domain temporarily."
echo ""

read -p "Enter your RESEND_API_KEY: " RESEND_API_KEY
read -p "Enter RESEND_FROM email (e.g. no-reply@galaxy.nyc): " RESEND_FROM
read -p "Enter RESEND_REPLY_TO email (optional, press Enter to skip): " RESEND_REPLY_TO

# Optional template strings, editable later without code changes
echo ""
echo "Alien email copy. Press Enter to accept defaults."
read -p "Subject [default: '👽 Transmission Received']: " ALIEN_SUBJECT
ALIEN_SUBJECT="${ALIEN_SUBJECT:-👽 Transmission Received}"

read -p "Line 1 [default: '👽 Thanks for your interest in extraterrestrial experiences.']: " ALIEN_LINE_1
ALIEN_LINE_1="${ALIEN_LINE_1:-👽 Thanks for your interest in extraterrestrial experiences.}"

read -p "Line 2 [default: 'We will be in touch when the mothership is ready. 🛸']: " ALIEN_LINE_2
ALIEN_LINE_2="${ALIEN_LINE_2:-We will be in touch when the mothership is ready. 🛸}"

echo ""
echo "Adding env vars to Vercel (production)..."
printf "%s\n" "$RESEND_API_KEY" | vercel env add RESEND_API_KEY production
printf "%s\n" "$RESEND_FROM"     | vercel env add RESEND_FROM production

if [ -n "${RESEND_REPLY_TO:-}" ]; then
  printf "%s\n" "$RESEND_REPLY_TO" | vercel env add RESEND_REPLY_TO production
fi

printf "%s\n" "$ALIEN_SUBJECT" | vercel env add ALIEN_SUBJECT production
printf "%s\n" "$ALIEN_LINE_1"  | vercel env add ALIEN_LINE_1  production
printf "%s\n" "$ALIEN_LINE_2"  | vercel env add ALIEN_LINE_2  production

echo ""
echo "Pulling envs locally (optional for dev runs)..."
vercel env pull .env.local || true

echo ""
echo "Step 4 — Deploying to production..."
vercel --prod

echo ""
echo "Copy your production URL from above (for example, https://your-project.vercel.app)."
read -p "Paste production URL here: " PROD_URL

# Normalize trailing slash
PROD_URL="${PROD_URL%/}"

echo ""
echo "Step 5 — Live test send."
read -p "Enter a test recipient email to receive the alien auto-reply: " TEST_EMAIL
read -p "Optional name to include (press Enter to skip): " TEST_NAME
TEST_NAME="${TEST_NAME:-Live Tester}"

echo ""
echo "Sending test POST to ${PROD_URL}/api/contact ..."
set +e
HTTP_CODE=$(curl -sS -o /tmp/alien_test_out.json -w "%{http_code}" \
  -X POST "${PROD_URL}/api/contact" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"name\":\"${TEST_NAME}\"}")
set -e

echo "Response code: $HTTP_CODE"
echo "Body:"
cat /tmp/alien_test_out.json
echo ""
echo "Done. Check Resend dashboard logs and the ${TEST_EMAIL} inbox."
echo "If delivery is missing, verify domain DKIM in Resend and ensure From matches a verified domain."
echo ""
echo "🛸 All set. Safe travels, Earthling."
