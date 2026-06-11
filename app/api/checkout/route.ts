import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type ProductType = 'paperback' | 'hardcover' | 'ebook' | 'audiobook';

const resolveProductType = (priceId: string): ProductType | null => {
    const {
        STRIPE_PRICE_PAPERBACK,
        STRIPE_PRICE_HARDCOVER,
        STRIPE_PRICE_EBOOK,
        STRIPE_PRICE_AUDIOBOOK,
    } = process.env

    if (priceId === STRIPE_PRICE_PAPERBACK) return 'paperback'
    if (priceId === STRIPE_PRICE_HARDCOVER) return 'hardcover'
    if (priceId === STRIPE_PRICE_EBOOK) return 'ebook'
    if (priceId === STRIPE_PRICE_AUDIOBOOK) return 'audiobook'
    return null
};

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const { priceId } = body ?? {}

        if (typeof priceId !== 'string' || !priceId) {
            return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
        }

        const productType = resolveProductType(priceId)
        if (!productType) {
            return NextResponse.json({ error: 'Invalid price Id' }, { status: 400 })
        }

        const isPhysical = productType === 'paperback' || productType === 'hardcover';

        const origin = req.headers.get('origin') ?? 'https://rethinkingbroken.com';

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{ price: priceId, quantity: 1 }],

            success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/shop`,

            ...(isPhysical && {
                shipping_address_collection: {
                    allowed_countries: ['US'],
                },
                shipping_options: [
                    { shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID! },
                ],
            }),

            metadata: {
                product_type: productType,
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (err) {
        console.error('[/api/checkout', err)
        return NextResponse.json(
            { error: 'Failed ot create checkout session' },
            {status: 500}
        );
    };
};