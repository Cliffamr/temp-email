import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';


// Force dynamic rendering to prevent build-time DB access
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { address } = body;

        if (!address) {
            return NextResponse.json(
                { error: 'Address is required' },
                { status: 400 }
            );
        }

        const normalizedAddress = address.toLowerCase().trim();

        // Find inbox by address
        const inbox = await prisma.inbox.findUnique({
            where: { address: normalizedAddress },
        });

        if (!inbox) {
            return NextResponse.json(
                { error: 'Inbox not found' },
                { status: 404 }
            );
        }

        // Token verification removed as per user request
        // Users can access inbox if they know the email address

        // Update last access time
        await prisma.inbox.update({
            where: { id: inbox.id },
            data: { lastAccessAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            data: {
                inboxId: inbox.id,
                address: inbox.address,
                publicExpiresAt: inbox.publicExpiresAt.toISOString(),
            },
        });
    } catch (error) {
        console.error('Error restoring inbox:', error);
        return NextResponse.json(
            { error: 'Failed to restore inbox' },
            { status: 500 }
        );
    }
}
