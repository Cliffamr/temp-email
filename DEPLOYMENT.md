# Deployment Guide

Complete step-by-step guide to deploy the Temporary Email application.

---

## Prerequisites

- Domain name(s) that you own
- Cloudflare account (free tier works)
- Vercel account (free tier works)
- PostgreSQL database (Vercel Postgres, Neon, or Supabase - all have free tiers)

---

## 1. Database Setup

### Option A: Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Copy the `DATABASE_URL` from the connection details

### Option B: Neon (Recommended for Hobby)

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

---

## 2. Generate Secrets

Generate a 64-character secret for webhook signing:

```bash
# Linux/Mac
openssl rand -hex 32

# Windows (PowerShell)
-join ((1..32) | ForEach-Object { '{0:X2}' -f (Get-Random -Maximum 256) })

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this secret - you'll need it for both Vercel and Cloudflare.

---

## 3. Deploy to Vercel

### Clone and Configure

```bash
# Install dependencies
cd temp-email
npm install

# Create .env file from example
cp env.example .env
# Edit .env with your values
```

### Environment Variables

Set these variables in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `ALLOWED_DOMAINS` | Comma-separated domains | `yourdomain.com,mail.yourdomain.com` |
| `WEBHOOK_SECRET` | 64-char hex secret | Output from step 2 |
| `INBOX_TTL_HOURS` | Inbox expiration time | `24` |

### Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add ALLOWED_DOMAINS
vercel env add WEBHOOK_SECRET
vercel env add INBOX_TTL_HOURS

# Deploy to production
vercel --prod
```

### Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

---

## 4. Cloudflare DNS Setup

### Add Your Domain

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Add a Site** and enter your domain
3. Follow the nameserver change instructions
4. Wait for DNS propagation (can take 24-48 hours)

### Configure MX Records

1. Go to **DNS** → **Records**
2. Add MX records pointing to Cloudflare Email Routing:

| Type | Name | Priority | Target |
|------|------|----------|--------|
| MX | @ | 36 | route1.mx.cloudflare.net |
| MX | @ | 42 | route2.mx.cloudflare.net |
| MX | @ | 2 | route3.mx.cloudflare.net |

3. Also add these TXT records for SPF:

| Type | Name | Content |
|------|------|---------|
| TXT | @ | `v=spf1 include:_spf.cloudflare.com -all` |

---

## 5. Deploy Cloudflare Email Worker

### Install Dependencies

```bash
cd cloudflare-worker
npm install
```

### Configure Worker

Edit `wrangler.toml`:

```toml
[vars]
WEBHOOK_URL = "https://your-vercel-app.vercel.app/api/webhooks/inbound-email"
```

### Set Secrets

```bash
# Set the webhook secret (same as Vercel)
npx wrangler secret put WEBHOOK_SECRET
# Enter your 64-char secret when prompted
```

### Deploy Worker

```bash
npx wrangler deploy
```

---

## 6. Configure Email Routing

### Enable Email Routing

1. In Cloudflare Dashboard, go to **Email** → **Email Routing**
2. Click **Get started** or **Enable Email Routing**
3. Verify the MX records are correct

### Create Catch-All Route

1. Go to **Email Routing** → **Routes**
2. Click **Create route**
3. Select **Catch-all** as the type
4. Under **Action**, select **Send to a Worker**
5. Choose your deployed `temp-email-worker`
6. Click **Save**

### Verify Setup

The Email Routing section should show:
- ✅ MX records configured
- ✅ Catch-all route → Email Worker

---

## 7. Seed Initial Domains (Optional)

If you want to pre-populate the Domain table:

```bash
npx prisma db seed
```

Or manually via Prisma Studio:

```bash
npx prisma studio
```

Then add your domains to the `Domain` table.

---

## 8. Test the Deployment

### Test Inbox Creation

1. Go to `https://your-vercel-app.vercel.app`
2. Create a new inbox with an alias
3. Copy the email address and token

### Test Email Reception

1. Send an email to the created address from another email account
2. Wait 5-30 seconds
3. The email should appear in the inbox

### Test Token Restoration

1. Go to `/restore`
2. Enter the email address and token
3. Verify you can access the inbox

---

## Troubleshooting

### Emails Not Arriving

1. Check Cloudflare Email Routing logs
2. Verify MX records are propagated (`dig MX yourdomain.com`)
3. Check Worker logs: `npx wrangler tail`
4. Verify webhook URL is correct in wrangler.toml

### 500 Errors on API

1. Check Vercel function logs
2. Verify DATABASE_URL is correct
3. Run `npx prisma migrate deploy` if schema changes

### Invalid Signature Errors

1. Ensure WEBHOOK_SECRET is identical on both Vercel and Cloudflare
2. Secrets are case-sensitive

---

## Cost Summary (Free Tier)

| Service | Free Tier Limit |
|---------|-----------------|
| Vercel | 100GB bandwidth, 100 hours edge functions |
| Cloudflare Email Routing | Unlimited emails |
| Cloudflare Workers | 100,000 requests/day |
| Neon PostgreSQL | 512MB storage, 3GB compute |
| Vercel Postgres | 256MB storage |

For most hobby projects, you'll stay well within free tier limits.

---

## Next Steps

- Set up custom domain on Vercel for nicer URLs
- Add more domains to ALLOWED_DOMAINS
- Monitor logs for issues
- Consider adding rate limiting for production use
