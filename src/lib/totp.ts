/**
 * TOTP (Time-based One-Time Password) utilities
 * All calculations happen client-side - secrets never leave the browser
 */

import * as OTPAuth from 'otpauth';

/**
 * Validate Base32 secret format
 */
export function isValidBase32(secret: string): boolean {
    // Remove spaces and convert to uppercase
    const normalized = secret.replace(/\s/g, '').toUpperCase();

    // Base32 alphabet: A-Z and 2-7
    const base32Regex = /^[A-Z2-7]+=*$/;

    // Minimum reasonable length (should be at least 16 chars for security)
    if (normalized.length < 16) {
        return false;
    }

    return base32Regex.test(normalized);
}

/**
 * Normalize Base32 secret (remove spaces, uppercase)
 */
export function normalizeSecret(secret: string): string {
    return secret.replace(/\s/g, '').toUpperCase();
}

/**
 * Generate TOTP code from secret
 */
export function generateTOTP(
    secret: string,
    options?: {
        digits?: number;
        period?: number;
        algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
    }
): string {
    const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(normalizeSecret(secret)),
        digits: options?.digits ?? 6,
        period: options?.period ?? 30,
        algorithm: options?.algorithm ?? 'SHA1',
    });

    return totp.generate();
}

/**
 * Get time remaining in current TOTP window (in seconds)
 */
export function getTimeRemaining(period: number = 30): number {
    const now = Math.floor(Date.now() / 1000);
    return period - (now % period);
}

/**
 * Get progress percentage for current TOTP window (0-100)
 */
export function getProgress(period: number = 30): number {
    const remaining = getTimeRemaining(period);
    return (remaining / period) * 100;
}
