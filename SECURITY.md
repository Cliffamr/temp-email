# Security Checklist

Security measures implemented in the Temporary Email application.

---

## ✅ Authentication & Access Control

| Item | Status | Implementation |
|------|--------|----------------|
| Token shown once only | ✅ | Token returned only at inbox creation |
| Token stored as hash | ✅ | bcrypt with 12 rounds in `crypto.ts` |
| Token verification rate limiting | ⚠️ | TODO: Add rate limiting |
| No user accounts | ✅ | Token-based access only |

---

## ✅ Webhook Security

| Item | Status | Implementation |
|------|--------|----------------|
| HMAC signature verification | ✅ | SHA-256 in `inbound-email/route.ts` |
| Timing-safe comparison | ✅ | Using `crypto.timingSafeEqual` |
| Signature in header | ✅ | `x-webhook-signature` header |
| Failed webhooks logged only | ✅ | Silent failure, no error exposure |

---

## ✅ Input Validation

| Item | Status | Implementation |
|------|--------|----------------|
| Alias format validation | ✅ | Regex + length checks in `validation.ts` |
| Blocked aliases | ✅ | admin, support, abuse, etc. blocked |
| Domain allowlist | ✅ | ALLOWED_DOMAINS environment variable |
| Email address validation | ✅ | Combined alias + domain validation |

---

## ✅ Content Security

| Item | Status | Implementation |
|------|--------|----------------|
| HTML sanitization | ✅ | DOMPurify in `email-parser.ts` |
| Script tags stripped | ✅ | FORBID_TAGS includes script |
| Event handlers removed | ✅ | FORBID_ATTR includes onclick, etc. |
| Iframe blocked | ✅ | FORBID_TAGS includes iframe |

---

## ✅ Data Protection

| Item | Status | Implementation |
|------|--------|----------------|
| Inbox TTL/expiration | ✅ | Configurable via INBOX_TTL_HOURS |
| Expired inbox rejection | ✅ | Checked on all access |
| Unknown inbox email drop | ✅ | Silent drop in webhook handler |
| Cascade delete on inbox | ✅ | Prisma onDelete: Cascade |

---

## ⚠️ Production Recommendations

### Rate Limiting (TODO)

Add rate limiting to these endpoints:

```typescript
// POST /api/inboxes - Limit inbox creation per IP
// Recommended: 10 inboxes per hour per IP

// POST /api/inboxes/restore - Limit failed attempts
// Recommended: 5 attempts per minute per IP

// POST /api/webhooks/inbound-email - Already protected by HMAC
// Consider limiting by sender domain
```

### Email Size Limits

Consider adding email size limits:

```typescript
// In webhook handler
if (rawEmail.length > 10 * 1024 * 1024) {
  console.log('Email too large, dropping');
  return;
}
```

### CORS Configuration

For production, restrict CORS origins:

```typescript
// In next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
      ],
    },
  ];
}
```

### Content Security Policy

Add CSP headers for the frontend:

```typescript
// In layout.tsx or middleware.ts
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

## 🚨 Important Warnings

1. **Testing Only Banner**: Always display the warning banner on the frontend
2. **No Sensitive Data**: Users should not send sensitive emails to temp addresses
3. **Token Security**: Tokens cannot be recovered - warn users to save them
4. **Inbox Expiration**: Make expiration time clear to users
5. **No Email Sending**: This app only receives email, cannot send

---

## Monitoring Recommendations

1. Monitor for suspicious patterns:
   - Many inboxes from same IP
   - High volume to single inbox
   - Unusual email sizes

2. Log security events:
   - Invalid webhook signatures
   - Token verification failures
   - Blocked alias attempts

3. Set up alerts for:
   - Database storage usage
   - Worker error rates
   - API error rates
