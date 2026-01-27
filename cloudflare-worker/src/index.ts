import PostalMime from 'postal-mime';

/**
 * Cloudflare Email Worker for Temp Email Application
 * 
 * This worker receives emails via Cloudflare Email Routing and forwards
 * them to the Vercel backend API via a signed webhook.
 */

export interface Env {
    WEBHOOK_URL: string;
    WEBHOOK_SECRET: string;
}

interface EmailMessage {
    readonly from: string;
    readonly to: string;
    readonly headers: Headers;
    readonly raw: ReadableStream;
    readonly rawSize: number;
    setReject(reason: string): void;
    forward(email: string, headers?: Headers): Promise<void>;
}

interface WebhookPayload {
    to: string;
    from: string;
    subject: string;
    date: string;
    text: string;
    html: string;
    raw: string; // Not strictly needed but kept for compatibility/signature
}

/**
 * Convert ReadableStream to string
 */
async function streamToString(stream: ReadableStream): Promise<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
    }

    result += decoder.decode();
    return result;
}

/**
 * Extract specific header value
 */
function getHeader(headers: Headers, name: string): string {
    return headers.get(name) || '';
}

/**
 * Convert Headers to plain object
 */
function headersToObject(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
        obj[key.toLowerCase()] = value;
    });
    return obj;
}

/**
 * Generate HMAC SHA-256 signature
 */
async function generateSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));

    // Convert ArrayBuffer to hex string
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Email handler - entry point for Cloudflare Email Routing
 */
// ... (previous code)

async function emailHandler(message: EmailMessage, env: Env): Promise<void> {
    try {
        if (!env.WEBHOOK_URL || !env.WEBHOOK_SECRET) {
            console.error('Missing required environment variables');
            return;
        }

        const raw = await streamToString(message.raw);

        // Parse email using PostalMime
        const parser = new PostalMime();
        const parsedEmail = await parser.parse(raw);

        // Create simplified payload
        const payload = {
            to: message.to,
            from: message.from,
            subject: parsedEmail.subject || '(No Subject)',
            date: parsedEmail.date || new Date().toISOString(),
            text: parsedEmail.text || '',
            html: parsedEmail.html || '',
            raw: '' // Sending empty raw to save bandwidth, not stored in DB anyway
        };

        const payloadString = JSON.stringify(payload);
        const signature = await generateSignature(payloadString, env.WEBHOOK_SECRET);

        const response = await fetch(env.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-signature': signature,
                'User-Agent': 'TempEmail-Cloudflare-Worker/1.0',
            },
            body: payloadString,
        });

        if (!response.ok) {
            console.error(`Webhook request failed: ${response.status} ${response.statusText}`);
        } else {
            console.log(`Email forwarded successfully: ${message.to}`);
        }
    } catch (error) {
        console.error('Error processing email:', error);
    }
}

export default {
    async email(message: EmailMessage, env: Env): Promise<void> {
        await emailHandler(message, env);
    },
};
