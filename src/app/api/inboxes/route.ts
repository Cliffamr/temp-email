import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateToken, hashToken, getPublicExpirationDate } from '@/lib/crypto';
import { validateAlias, validateDomain, getAllowedDomains } from '@/lib/validation';

// Force dynamic rendering to prevent build-time DB access
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { alias, domain } = body;

        // Validate alias
        const aliasValidation = validateAlias(alias);
        if (!aliasValidation.valid) {
            return NextResponse.json(
                { error: aliasValidation.error },
                { status: 400 }
            );
        }

        // Validate domain
        const domainValidation = validateDomain(domain);
        if (!domainValidation.valid) {
            return NextResponse.json(
                { error: domainValidation.error },
                { status: 400 }
            );
        }

        const normalizedAlias = alias.toLowerCase().trim();
        const normalizedDomain = domain.toLowerCase().trim();
        const address = `${normalizedAlias}@${normalizedDomain}`;

        // Check if address already exists and is not expired
        const existingInbox = await prisma.inbox.findUnique({
            where: { address },
        });

        if (existingInbox && existingInbox.publicExpiresAt > new Date()) {
            return NextResponse.json(
                { error: 'This email address is already in use' },
                { status: 409 }
            );
        }

        // Delete expired inbox if exists
        if (existingInbox) {
            await prisma.inbox.delete({
                where: { id: existingInbox.id },
            });
        }

        // Get or create domain record
        let domainRecord = await prisma.domain.findUnique({
            where: { domain: normalizedDomain },
        });

        if (!domainRecord) {
            domainRecord = await prisma.domain.create({
                data: {
                    domain: normalizedDomain,
                    isActive: true,
                },
            });
        }

        // Generate token and hash
        const token = generateToken();
        const tokenHash = await hashToken(token);
        const publicExpiresAt = getPublicExpirationDate();

        // Create inbox
        const inbox = await prisma.inbox.create({
            data: {
                address,
                tokenHash,
                publicExpiresAt,
                domainId: domainRecord.id,
            },
        });

        // TODO: Add rate limiting here
        // Consider limiting inbox creation per IP address

        return NextResponse.json({
            success: true,
            data: {
                inboxId: inbox.id,
                address: inbox.address,
                token, // Only returned ONCE at creation
                publicExpiresAt: inbox.publicExpiresAt.toISOString(),
            },
        });
    } catch (error) {
        console.error('Error creating inbox:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to create inbox', details: errorMessage },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const domains = getAllowedDomains();
        return NextResponse.json({
            success: true,
            data: {
                domains,
            },
        });
    } catch (error) {
        console.error('Error fetching domains:', error);
        return NextResponse.json(
            { error: 'Failed to fetch domains' },
            { status: 500 }
        );
    }
}
