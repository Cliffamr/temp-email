import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { createHmac, timingSafeEqual } from 'crypto';

const SALT_ROUNDS = 12;

/**
 * Generate a secure random token (64 characters)
 */
export function generateToken(): string {
    return randomBytes(32).toString('hex');
}

/**
 * Hash a token using bcrypt
 */
export async function hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, SALT_ROUNDS);
}

/**
 * Verify a token against its hash
 */
export async function verifyToken(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
}

/**
 * Generate HMAC SHA-256 signature
 */
export function generateHmacSignature(payload: string, secret: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verify HMAC SHA-256 signature with timing-safe comparison
 */
export function verifyHmacSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const expectedSignature = generateHmacSignature(payload, secret);

    // Ensure both signatures are the same length for timing-safe comparison
    if (signature.length !== expectedSignature.length) {
        return false;
    }

    try {
        return timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    } catch {
        return false;
    }
}

/**
 * Generate public access expiration date (24 hours default)
 */
export function getPublicExpirationDate(hoursFromNow?: number): Date {
    const hours = hoursFromNow || parseInt(process.env.INBOX_TTL_HOURS || '24', 10);
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
}
