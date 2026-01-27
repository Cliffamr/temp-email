// Blocked aliases that cannot be used for inbox creation
const BLOCKED_ALIASES = new Set([
    'admin',
    'administrator',
    'support',
    'billing',
    'abuse',
    'noreply',
    'no-reply',
    'postmaster',
    'hostmaster',
    'webmaster',
    'mailer-daemon',
    'root',
    'security',
    'ssl',
    'ftp',
    'www',
    'mail',
    'email',
    'help',
    'info',
    'contact',
    'sales',
    'marketing',
    'spam',
    'phishing',
    'dmca',
    'legal',
    'privacy',
    'terms',
    'newsletter',
    'unsubscribe',
]);

// Alias validation regex: alphanumeric, dots, hyphens, underscores, 3-32 chars
const ALIAS_REGEX = /^[a-z0-9][a-z0-9._-]{1,30}[a-z0-9]$/;

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate an email alias
 */
export function validateAlias(alias: string): ValidationResult {
    const normalizedAlias = alias.toLowerCase().trim();

    if (!normalizedAlias) {
        return { valid: false, error: 'Alias is required' };
    }

    if (normalizedAlias.length < 3) {
        return { valid: false, error: 'Alias must be at least 3 characters' };
    }

    if (normalizedAlias.length > 32) {
        return { valid: false, error: 'Alias must be at most 32 characters' };
    }

    if (!ALIAS_REGEX.test(normalizedAlias)) {
        return {
            valid: false,
            error: 'Alias must start and end with alphanumeric characters and can only contain letters, numbers, dots, hyphens, and underscores',
        };
    }

    if (BLOCKED_ALIASES.has(normalizedAlias)) {
        return { valid: false, error: 'This alias is reserved and cannot be used' };
    }

    // Check for consecutive dots or hyphens
    if (/\.{2,}|--/.test(normalizedAlias)) {
        return { valid: false, error: 'Alias cannot contain consecutive dots or hyphens' };
    }

    return { valid: true };
}

/**
 * Get allowed domains from environment variable
 */
export function getAllowedDomains(): string[] {
    const domains = process.env.ALLOWED_DOMAINS || '';
    return domains
        .split(',')
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean);
}

/**
 * Validate a domain against allowed domains
 */
export function validateDomain(domain: string): ValidationResult {
    const normalizedDomain = domain.toLowerCase().trim();
    const allowedDomains = getAllowedDomains();

    if (!normalizedDomain) {
        return { valid: false, error: 'Domain is required' };
    }

    if (allowedDomains.length === 0) {
        return { valid: false, error: 'No allowed domains configured' };
    }

    if (!allowedDomains.includes(normalizedDomain)) {
        return { valid: false, error: 'Domain is not allowed' };
    }

    return { valid: true };
}

/**
 * Validate a complete email address
 */
export function validateEmailAddress(address: string): ValidationResult {
    const parts = address.split('@');

    if (parts.length !== 2) {
        return { valid: false, error: 'Invalid email address format' };
    }

    const [alias, domain] = parts;

    const aliasValidation = validateAlias(alias);
    if (!aliasValidation.valid) {
        return aliasValidation;
    }

    const domainValidation = validateDomain(domain);
    if (!domainValidation.valid) {
        return domainValidation;
    }

    return { valid: true };
}
