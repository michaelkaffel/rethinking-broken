'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type OrderData = {
    orderNumber: number
    customerName: string
    customerEmail: string
    productType: 'paperback' | 'hardcover' | 'ebook' | 'audiobook'
    amountTotal: number // cents
    shippingAddress?: {
        line1: string
        line2?: string
        city: string
        state: string
        postal_code: string
        country: string
    } | null
    downloadToken?: string | null
    tokenExpiresAt?: string | null
}

const PRODUCT_LABELS: Record<string, string> = {
    paperback: 'Paperback',
    hardcover: 'Hardcover',
    ebook: 'eBook PDF',
    audiobook: 'Audiobook',
};

const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    })

const ThankYouContent = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [order, setOrder] = useState<OrderData | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    useEffect(() => {
        if (!sessionId) { setStatus('error'); return }

        let attempts = 0;
        const MAX = 8;
        const DELAY = 1500;

        const poll = async () => {
            try {
                const res = await fetch(`/api/order?session_id=${sessionId}`)
                if (res.ok) {
                    setOrder(await res.json())
                    setStatus('ready');
                    return
                }

                if (res.status === 404 && attempts < MAX) {
                    attempts++
                    setTimeout(poll, DELAY)
                } else {
                    setStatus('error');
                }
            } catch {
                if (attempts < MAX) { attempts++; setTimeout(poll, DELAY) }
                else setStatus('error')
            }
        }

        poll()
    }, [sessionId])

    const isDigital = order?.productType === 'ebook' || order?.productType === 'audiobook'
    const isPhysical = order?.productType === 'paperback' || order?.productType === 'hardcover'

    // Loading
    if (status === 'loading') {
        return (
            <main className='min-h-screen bg-bg-deep flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-12 h-12 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4' />
                    <p className='font-lato text-text-muted'>Confirming your order...</p>
                </div>
            </main>
        )
    }

    // Error / not found
    if (status === 'error') {
        return (
            <main className='min-h-screen bg-bg-deep flex items-center justify-center px-4'>
                <div className='text-center max-w-md'>
                    <h1 className='font-cinzel text-2xl text-brand-yellow mb-4'>Order Received</h1>
                    <p className='font-lato text-text-muted mb-6'>
                        Your payment was successful. You&rsquo;ll receive a confirmation email shortly.
                        {' '}If you purchased a digital product, your download link will be in that email.
                    </p>
                    <Link href="/" className='font-lato text-brand-yellow hover:underline'>
                        Return home
                    </Link>
                </div>
            </main>
        )
    }

    // Success
    return (
        <main className='min-h-screen bg-bg-deep py-20 px-4'>
            <div className='max-w-lg mx-auto'>

                {/* Header */}
                <div className='text-center mb-10'>
                    <div className='w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mx-auto mb-6'>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"
                            className="text-brand-yellow">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h1 className='font-cinzel text-3xl text-brand-yellow mb-3'>Thank You!</h1>
                    <p className='font-lato text-text-muted'>
                        {isDigital
                            ? `Your order is confirmed and your download is ready below.`
                            : `Your order is confirmed. We'll get it in the mail soon.`}
                    </p>
                </div>

                {/* Order summary */}
                <div className="border border-white/10 rounded-lg p-6 mb-6 bg-white/5">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <span className="font-cinzel text-xs text-text-muted tracking-widest uppercase">
                            Order Summary
                        </span>
                        <span className="font-lato text-text-light">#{order!.orderNumber}</span>
                    </div>

                    <dl className="space-y-3 font-lato text-sm">
                        <div className="flex justify-between">
                            <dt className="text-text-muted">Product</dt>
                            <dd className="text-text-light">{PRODUCT_LABELS[order!.productType]}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-text-muted">Name</dt>
                            <dd className="text-text-light">{order!.customerName}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-text-muted">Email</dt>
                            <dd className="text-text-light">{order!.customerEmail}</dd>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-white/10">
                            <dt className="text-text-muted">Total</dt>
                            <dd className="text-text-light font-semibold">{fmt(order!.amountTotal)}</dd>
                        </div>
                    </dl>
                </div>

                {/* Shipping address (physical only) */}
                {isPhysical && order!.shippingAddress && (
                    <div className='border border-white/10 rounded-lg p-6 mb-6 bg-white/5'>
                        <h2 className='font-cinzel text-xs text-text-muted tracking-widest uppercase mb-3'>
                            Ships To
                        </h2>
                        <address className="font-lato text-sm text-text-light not-italic leading-relaxed">
                            {order!.customerName}<br />
                            {order!.shippingAddress.line1}<br />
                            {order!.shippingAddress.line2 && <>{order!.shippingAddress.line2}<br /></>}
                            {order!.shippingAddress.city}, {order!.shippingAddress.state}{' '}
                            {order!.shippingAddress.postal_code}
                        </address>
                        <p className='font-lato text-xs text-text-muted mt-3'>
                            Estimated delivery: 3—5 business days via USPS Media Mail
                        </p>
                    </div>
                )}

                {/* Download button (digital only) */}
                {isDigital && order!.downloadToken && (
                    <div className='border border-brand-yellow/20 rounded-lg p-6 mb-6 bg-brand-yellow/5'>
                        <h2 className='font-cinzel text-xs text-text-muted tracking-widest uppercase mb-1'>
                            Your Download
                        </h2>
                        {order!.tokenExpiresAt && (
                            <p className='font-lato text-xs text-text-muted mb-4'>
                                Link valid until {fmtDate(order!.tokenExpiresAt)}. A copy was also sent to your email.
                            </p>
                        )}
                        <a
                            href={`/api/download?token=${order!.downloadToken}`}
                            className='flex items-center justify-center gap-2 w-full bg-brand-yellow text-bg-deep font-lato font-semibold py-3 px-6 rounded-lg hover:bg-brand-yellow/90 transition-colors'
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download {PRODUCT_LABELS[order!.productType]}
                        </a>
                    </div>
                )}

                {/* Nav links */}
                <p className='text-center font-lato text-sm text-text-muted'>
                    <Link href="/" className='text-brand-yellow hover:underline'>Return home</Link>
                    {' · '}
                    <Link href="/shop" className='text-brand-yellow hover:underline'>Back to shop</Link>
                </p>
            </div>
        </main>
    );
};

export default ThankYouContent;