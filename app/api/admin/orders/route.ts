import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const GET = async (req: NextRequest) => {
    const email = req.nextUrl.searchParams.get('email')?.trim();
    if (!email) return NextResponse.json({ orders: [] });

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            id,
            order_number,
            created_at,
            customer_name,
            customer_email,
            product_type,
            amount_total,
            shipping_address,
            download_tokens (
            token,
            expired_at,
            used_count,
            created_at
            )    
        `)
        .ilike('customer_email', `%${email}`)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Admin orders query error:', error)
        return NextResponse.json({ error: error.message}, {status: 500 })
    }

    // For each order show only most recent token
    const normalized = (orders ?? []).map(o => ({
        ...o,
        download_tokens: [...(o.download_tokens ?? [])]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 1)
    }))

    return NextResponse.json({ orders: normalized })
}