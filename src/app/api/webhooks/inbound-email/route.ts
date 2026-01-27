import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyHmacSignature } from '@/lib/crypto';
import { sanitizeHtml } from '@/lib/email-parser';

// Force dynamic rendering to prevent build-time DB access
export const dynamic = 'force-dynamic';

interface WebhookPayload {
    to: string;
    from: string;
    subject: string;
    date: string;
    text: string;
    html: string;
    raw: string;
}

export async function POST(request: NextRequest) {
    try {
        // Get webhook secret
        const webhookSecret = process.env.WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('WEBHOOK_SECRET not configured');
            // Fail silently to not bounce email
            return NextResponse.json({ success: true });
        }

        // Get signature from header
        const signature = request.headers.get('x-webhook-signature');
        if (!signature) {
            console.error('Missing webhook signature');
            return NextResponse.json({ success: true });
        }

        // Get raw body for signature verification (it's JSON string now)
        const rawBody = await request.text();

        // Verify HMAC signature
        const isValidSignature = verifyHmacSignature(rawBody, signature, webhookSecret);
        if (!isValidSignature) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ success: true });
        }

        // Parse the JSON payload
        const payload: WebhookPayload = JSON.parse(rawBody);

        if (!payload.to) {
            console.error('Missing required fields in payload');
            return NextResponse.json({ success: true });
        }

        // Extract recipient address (handle multiple recipients, take first)
        const recipientAddress = payload.to.toLowerCase().trim();

        // Find inbox by address
        const inbox = await prisma.inbox.findUnique({
            where: { address: recipientAddress },
        });

        if (!inbox) {
            // Inbox not found - drop email silently
            console.log(`Email dropped: inbox not found for ${recipientAddress}`);
            return NextResponse.json({ success: true });
        }

        // No expiration check - emails can be received even after public access expires

        // Sanitize existing HTML or text
        const sanitizedHtml = sanitizeHtml(payload.html || payload.text || '');

        // Store the message
        await prisma.message.create({
            data: {
                inboxId: inbox.id,
                fromAddress: payload.from || '',
                toAddress: payload.to || '',
                subject: payload.subject || '(No Subject)',
                date: payload.date ? new Date(payload.date) : new Date(),
                textContent: payload.text || '',
                sanitizedHtml: sanitizedHtml,
                headersJson: JSON.stringify({}), // Headers simplified/empty from worker
                size: (payload.text?.length || 0) + (payload.html?.length || 0),
            },
        });

        // Update inbox last access time
        await prisma.inbox.update({
            where: { id: inbox.id },
            data: { lastAccessAt: new Date() },
        });

        console.log(`Email received for ${recipientAddress}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing inbound email:', error);
        // Always return success to not bounce emails
        return NextResponse.json({ success: true });
    }
}

// Disable body parser since we need raw body for signature verification
export const runtime = 'nodejs';
