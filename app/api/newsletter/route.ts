import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sanitizeEmail, sanitizeName } from '@/lib/sanitize';

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (req: NextRequest) => {
    const contentType = req.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 415 })
    }

    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { email: rawEmail, firstName: rawFirst, lastName: rawLast } = body as Record<string, unknown>

    const email = sanitizeEmail(rawEmail)
    if (!email) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const firstName = sanitizeName(rawFirst);
    const lastName = sanitizeName(rawLast)

    if (firstName === null) {
        return NextResponse.json({ error: 'First name is required' }, { status: 400 })
    }
    if (lastName === null) {
        return NextResponse.json({ error: 'Last name is required' }, { status: 400 })
    }

    try {
        const { error } = await resend.contacts.create({
            audienceId: process.env.RESEND_AUDIENCE_ID!,
            email,
            firstName,
            lastName,
            unsubscribed: false,
        })

        if (error) {
            if ((error as { name?: string }).name === 'already_exists') {
                return NextResponse.json({ success: true })
            }
            console.error('Resend contacts error:', error)
            return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Newsletter route error:', err)
        return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
    };
};