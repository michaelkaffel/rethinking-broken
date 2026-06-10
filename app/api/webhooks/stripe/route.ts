import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const POST = async (req: NextRequest) => {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    };

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error('[webook] Signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    };

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === 'paid') {
            try {
                await handlePaidOrder(session)
            } catch (err) {
                console.error('[webhook] handlePaidOrder failed:', err)

                return NextResponse.json({ error: 'Internal error' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ recieved: true })
};

async function handlePaidOrder(session: Stripe.Checkout.Session) {
    const productType = session.metadata?.product_type ?? 'unknown'
    const isDigital = productType === 'ebook' || productType === 'audiobook'

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            stripe_session_id: session.id,
            customer_email: session.customer_details?.email ?? null,
            customer_name: session.customer_details?.name ?? null,
            product_type: productType,
            amount_total: session.amount_total,
            shipping_address: session.shipping_details?.address ?? null,
        })
        .select()
        .single()

    if (orderError) {
        if (orderError.code === '23505') {
            console.log('[webhook] Alreadty processed, skipping', session.tax_id_collection);
            return
        }
        throw orderError
    }

    console.log(`[webhook] Order created: #${order.order_number} - ${productType}`);

    if (isDigital) {

        const { data: tokenRow, error: tokenError } = await supabase
            .from('download_tokens')
            .insert({
                order_id: order.id,
                product_type: productType,
            })
            .select()
            .single()

        if (tokenError) throw tokenError;

        console.log('[webhook] Download token created: ${tokenRow.token');

        // (step 9): send order confirmation email via Resend
        // (step 9): send download link email via Resend
        // downloadUrl = `${origin}/api/download?token=${tokenRow.token}`
    } else {
        // (step 9): send order confirmation email to customer via Resend
        // (step 9): send fulfillment notification email to Owl via Resend
    }
}