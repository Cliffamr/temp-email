import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Force dynamic rendering to prevent build-time DB access
export const dynamic = 'force-dynamic';

interface Params {
    params: Promise<{
        inboxId: string;
        messageId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { inboxId, messageId } = await params;

        // Verify inbox exists and is not expired
        const inbox = await prisma.inbox.findUnique({
            where: { id: inboxId },
        });

        if (!inbox) {
            return NextResponse.json(
                { error: 'Inbox not found' },
                { status: 404 }
            );
        }

        // Public expiration check removed as per user request
        // Messages are accessible as long as the inbox exists

        // Fetch the message
        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                inboxId,
            },
        });

        if (!message) {
            return NextResponse.json(
                { error: 'Message not found' },
                { status: 404 }
            );
        }

        // Parse headers
        let headers = {};
        try {
            headers = message.headersJson ? JSON.parse(message.headersJson) : {};
        } catch {
            headers = {};
        }

        // Update last access time
        await prisma.inbox.update({
            where: { id: inboxId },
            data: { lastAccessAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            data: {
                id: message.id,
                from: message.fromAddress,
                to: message.toAddress,
                subject: message.subject,
                date: message.date?.toISOString() || message.createdAt.toISOString(),
                text: message.textContent,
                html: message.sanitizedHtml,
                headers,
                size: message.size,
                createdAt: message.createdAt.toISOString(),
            },
        });
    } catch (error) {
        console.error('Error fetching message:', error);
        return NextResponse.json(
            { error: 'Failed to fetch message' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { inboxId, messageId } = await params;

        // Verify inbox exists
        const inbox = await prisma.inbox.findUnique({
            where: { id: inboxId },
        });

        if (!inbox) {
            return NextResponse.json(
                { error: 'Inbox not found' },
                { status: 404 }
            );
        }

        // Delete the message
        await prisma.message.delete({
            where: {
                id: messageId,
                inboxId,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { error: 'Failed to delete message' },
            { status: 500 }
        );
    }
}
