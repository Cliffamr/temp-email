import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Force dynamic rendering to prevent build-time DB access
export const dynamic = 'force-dynamic';

interface Params {
    params: Promise<{
        inboxId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: Params
) {
    try {
        const { inboxId } = await params;

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


        // Get pagination params
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 50);
        const skip = (page - 1) * limit;

        // Fetch messages
        const [messages, totalCount] = await Promise.all([
            prisma.message.findMany({
                where: { inboxId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    fromAddress: true,
                    subject: true,
                    date: true,
                    textContent: true,
                    size: true,
                    createdAt: true,
                },
            }),
            prisma.message.count({
                where: { inboxId },
            }),
        ]);

        // Create preview from text content
        const messagesWithPreview = messages.map((msg: {
            id: string;
            fromAddress: string;
            subject: string | null;
            date: Date | null;
            textContent: string | null;
            size: number;
            createdAt: Date;
        }) => ({
            id: msg.id,
            from: msg.fromAddress,
            subject: msg.subject,
            date: msg.date?.toISOString() || msg.createdAt.toISOString(),
            preview: msg.textContent
                ? msg.textContent.substring(0, 100).replace(/\s+/g, ' ').trim() + (msg.textContent.length > 100 ? '...' : '')
                : '',
            size: msg.size,
        }));

        // Update last access time
        await prisma.inbox.update({
            where: { id: inboxId },
            data: { lastAccessAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            data: {
                messages: messagesWithPreview,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                },
                inbox: {
                    address: inbox.address,
                    publicExpiresAt: inbox.publicExpiresAt.toISOString(),
                },
            },
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}
