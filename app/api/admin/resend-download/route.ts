import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDownloadEmail } from '@/lib/email';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = async (req: NextRequest) => {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    // Fetch order
    const { data: order, error: orderErr} = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

    if (orderErr || !order) {
        return NextResponse.json({ error: 'Order not found' }, {status: 400 });
    };

    // Generate a fresh download token
    const { data: token, error: tokenErr } = await supabase
        .from('download_tokens')
        .insert({ order_id: orderId, product_type: order.product_type })
        .select()
        .single()

    if (tokenErr || !token) {
        console.error('Token insert error:', tokenErr)
        return NextResponse.json({ error: 'Failed to generate token'}, { status: 500 });
    };

    // Send download email
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rethinkingbroken.com'
    const downloadUrl = `${baseUrl}/api/download?token=${token.token}`

    try {
        await sendDownloadEmail({
            to: order.customer_email,
            customerName: order.customer_name,
            orderNumber: order.order_number,
            productType: order.product_type,
            downloadUrl,
            expiresAt: new Date(token.expires_at),
        })
    } catch (emailErr) {
        console.error('Resend email error:', emailErr)
        return NextResponse.json({ error: 'Token created but email failed to send'}, { status: 500 });
    }

    return NextResponse.json({ ok: true })
};

