// Basic HTML sanitization (placeholder)
export function sanitizeHtml(html: string): string {
    if (!html) return '';
    // WARNING: This is not secure. Proper sanitization should be moved to Cloudflare Worker using HTMLRewriter.
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, "")
        .replace(/on\w+="[^"]*"/g, "");
}

/**
 * Get a text preview from email content
 */
export function getEmailPreview(text: string, maxLength: number = 100): string {
    if (!text) return '';

    // Remove extra whitespace and newlines
    const cleaned = text.replace(/\s+/g, ' ').trim();

    if (cleaned.length <= maxLength) {
        return cleaned;
    }

    return cleaned.substring(0, maxLength).trim() + '...';
}
