<div align="center">
  <img src="public/readme-hero.svg" alt="Temp Email — disposable inbox platform" width="100%" />

  <br />

  [![Next.js](https://img.shields.io/badge/Next.js-16-0B1220?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-0B1220?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-0B1220?style=for-the-badge&logo=postgresql&logoColor=78B7E5)](https://www.postgresql.org/)
  [![Cloudflare](https://img.shields.io/badge/Cloudflare-Email_Worker-0B1220?style=for-the-badge&logo=cloudflare&logoColor=F48120)](https://developers.cloudflare.com/email-routing/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-0B1220?style=for-the-badge&logo=typescript&logoColor=61A9FF)](https://www.typescriptlang.org/)

  **A self-hosted disposable email platform with expiring inboxes, real-time delivery, token recovery, and multi-domain support.**

  [Features](#-features) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [API](#-automation-api) · [Deployment](#-deployment)
</div>

---

## ✦ Overview

Temp Email turns your domains into private, disposable inboxes. Cloudflare Email Routing receives incoming mail, an Email Worker parses it, and a signed webhook delivers sanitized messages to the Next.js application.

Built for QA, signup testing, demos, and protecting a primary inbox from unwanted mail.

> [!WARNING]
> Temporary inboxes are not suitable for banking, account recovery, confidential data, or other critical communication. This service is receive-only.

## ✨ Features

<table>
  <tr>
    <td width="33%"><b>⚡ Instant inboxes</b><br />Create an alias on any active domain in seconds.</td>
    <td width="33%"><b>📨 Real-time delivery</b><br />Receive HTML and plain-text email through Cloudflare.</td>
    <td width="33%"><b>⏳ Expiring access</b><br />Public inbox access expires after a configurable TTL.</td>
  </tr>
  <tr>
    <td><b>🔑 Token recovery</b><br />Restore an inbox from another browser using its one-time token.</td>
    <td><b>🌐 Multiple domains</b><br />Enable or disable receiving domains from the admin panel.</td>
    <td><b>🛡️ Signed ingestion</b><br />Inbound webhooks use HMAC SHA-256 verification.</td>
  </tr>
  <tr>
    <td><b>🧼 Safe rendering</b><br />Incoming HTML is sanitized before storage and display.</td>
    <td><b>🔐 User and admin access</b><br />NextAuth credentials plus role-aware administration.</td>
    <td><b>🤖 Automation API</b><br />Create inboxes programmatically with an API key.</td>
  </tr>
</table>

## 🧭 Architecture

```mermaid
flowchart LR
    Sender([Email sender]) --> CF[Cloudflare Email Routing]
    CF --> Worker[Email Worker<br/>PostalMime parser]
    Worker -->|HMAC-signed webhook| API[Next.js API]
    API -->|sanitize + persist| DB[(PostgreSQL<br/>Prisma)]
    User([Browser / API client]) --> App[Next.js UI]
    App --> API
    API --> DB

    classDef edge fill:#102a24,stroke:#56e0c4,color:#eafffa;
    classDef app fill:#102742,stroke:#61a9ff,color:#eef7ff;
    classDef data fill:#261f3d,stroke:#a78bfa,color:#f7f2ff;
    class Worker,CF edge;
    class API,App app;
    class DB data;
```

### Mail flow

1. Cloudflare catches mail for a configured domain.
2. The Worker parses MIME content with `postal-mime`.
3. The Worker signs the JSON payload using HMAC SHA-256.
4. Next.js verifies the signature and locates the inbox.
5. Email HTML is sanitized, then stored in PostgreSQL.
6. The inbox UI fetches and displays the message.

## 🧱 Stack

| Layer | Technology |
|---|---|
| Web application | Next.js 16, React 19, TypeScript |
| Authentication | NextAuth v5, bcrypt |
| Database | PostgreSQL, Prisma ORM |
| Email ingestion | Cloudflare Email Routing + Workers |
| MIME parsing | PostalMime |
| Validation | Zod |
| Hosting | Vercel + Cloudflare |

## 🚀 Quick Start

### Requirements

- Node.js 20+
- PostgreSQL database
- npm

### 1. Clone and install

```bash
git clone https://github.com/Cliffamr/temp-email.git
cd temp-email
npm install
```

### 2. Configure environment

```bash
cp env.example .env.local
```

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/temp_email"
ALLOWED_DOMAINS="mail.example.com"
WEBHOOK_SECRET="replace-with-64-character-secret"
INBOX_TTL_HOURS="24"
TEMPMAIL_API_KEY="optional-automation-api-key"
```

Generate secure secrets:

```bash
openssl rand -hex 32
```

### 3. Prepare the database

```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🤖 Automation API

Create inboxes from scripts without a browser session by configuring `TEMPMAIL_API_KEY`.

```bash
curl -X POST http://localhost:3000/api/inboxes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEMPMAIL_API_KEY" \
  -d '{
    "alias": "build-check",
    "domain": "mail.example.com"
  }'
```

The key can also be sent through `X-API-Key`.

Example response:

```json
{
  "success": true,
  "data": {
    "inboxId": "cm...",
    "address": "build-check@mail.example.com",
    "token": "shown-only-at-creation",
    "publicExpiresAt": "2026-01-02T12:00:00.000Z"
  }
}
```

> [!IMPORTANT]
> The recovery token is returned only when the inbox is created. Store it securely if later access is required.

## ☁️ Deployment

The production path uses three components:

| Component | Purpose |
|---|---|
| Vercel | Hosts the Next.js application and API |
| PostgreSQL | Stores domains, inboxes, messages, and users |
| Cloudflare | Receives domain email and runs the parsing Worker |

High-level deployment:

1. Provision PostgreSQL and add application environment variables.
2. Deploy the Next.js app to Vercel.
3. Add your domain to Cloudflare and enable Email Routing.
4. Configure MX records and a catch-all route to the Worker.
5. Set `WEBHOOK_URL` in `cloudflare-worker/wrangler.toml`.
6. Set the same `WEBHOOK_SECRET` in Vercel and Cloudflare.
7. Deploy the Worker with `npm run deploy` from `cloudflare-worker/`.

Full instructions: **[DEPLOYMENT.md](DEPLOYMENT.md)**

## 🛡️ Security model

- Recovery tokens are hashed with bcrypt before storage.
- Webhook signatures use HMAC SHA-256 and timing-safe comparison.
- Incoming HTML is sanitized before display.
- Unknown inbox recipients are dropped silently.
- Domain availability is controlled from the database.
- Messages are deleted automatically when their parent inbox is deleted.

Production hardening and open items: **[SECURITY.md](SECURITY.md)**

## 📁 Project map

```text
.
├── src/app/                 # Pages, admin UI, and API routes
├── src/components/          # Inbox, form, and navigation components
├── src/lib/                 # Crypto, parsing, validation, and DB helpers
├── prisma/                  # PostgreSQL schema
├── cloudflare-worker/       # Email Routing ingestion worker
├── public/                  # Static assets
├── DEPLOYMENT.md            # Production deployment guide
└── SECURITY.md              # Security checklist
```

## 🧪 Quality checks

```bash
npm run lint
npm run build
```

Worker checks:

```bash
cd cloudflare-worker
npm install
npx tsc --noEmit
```

## 🗺️ Roadmap

- [ ] Rate limiting for inbox creation and token restoration
- [ ] Email size limits
- [ ] Automated expired-inbox cleanup job
- [ ] Attachment handling
- [ ] End-to-end mail delivery tests

## 🤝 Contributing

Issues and focused pull requests are welcome. Keep changes small, document environment changes, and run lint/build checks before submitting.

---

<div align="center">
  <sub>Built for disposable workflows—not permanent identities.</sub>
</div>
