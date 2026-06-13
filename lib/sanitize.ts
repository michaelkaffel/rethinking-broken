// RFC 5321 max email length
const EMAIL_MAX_LENGTH = 254
const NAME_MAX_LENGTH = 100

// Sanitizes and validates email. Returns cleaned email or null
export const sanitizeEmail = (raw: unknown): string | null => {
    if (typeof raw !== 'string') return null;

    const email = raw
        .trim()
        .toLowerCase()
        .replace(/[\x00-\x1f\x7f]/g, '')

    if (email.length === 0 || email.length > EMAIL_MAX_LENGTH) return null;

    // RFC 5322-ish: local@domain.tld
    const EMAIL_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/
    if (!EMAIL_RE.test(email)) return null

    return email;
};


// Sanitizes and validates name fields. Returns cleaned name or null
export const sanitizeName = (raw: unknown, required = true): string | null => {
    if (typeof raw !== 'string') return required ? null : '';

    const name = raw
        .trim()
        .replace(/[\x00-\x1f\x7f]/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')

    if (required && name.length === 0) return null;
    if (name.length > NAME_MAX_LENGTH) return null

    return name
}