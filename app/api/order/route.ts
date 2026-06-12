import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const GET = async (req: NextRequest) => {
    const sessionId = req.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single()

    if (error || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const isDigital = order.product_type === 'ebook' || order.product_type === 'audiobook';
    let downloadToken = null
    let tokenExpiresAt = null

    if (isDigital) {
        const { data: token } = await supabase
            .from('download_tokens')
            .select('token, expires_at')
            .eq('order_id', order.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (token) {
            downloadToken = token.token
            tokenExpiresAt = token.expires_at
        }
    }

    return NextResponse.json({
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        productType: order.product_type,
        amountTotal: order.amount_total,
        shippingAddress: order.shipping_address ?? null,
        downloadToken,
        tokenExpiresAt,
    })
};