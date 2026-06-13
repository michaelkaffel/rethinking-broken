'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type DownloadToken = {
    token: string
    expires_at: string
    used_count: number
    created_at: string
}

type ShippingAddress = {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
}

type Order = {
    id: string
    order_number: number
    created_at: string
    customer_name: string
    customer_email: string
    product_type: 'paperback' | 'hardcover' | 'ebook' | 'audiobook'
    amount_total: number
    shipping_address: ShippingAddress | null
    download_tokens: DownloadToken[]
}

const isDigital = (type: string) => type === 'ebook' || type === 'audiobook';
const formatAmount = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

const AdminPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [searched, setSearched] = useState(false)
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchOrders = async (emailFilter?: string) => {
        setLoading(true);
        setMessage(null);
        setSearched(false);
        const url = emailFilter
            ? `/api/admin/orders?email=${encodeURIComponent(emailFilter)}`
            : '/api/admin/orders';
        const res = await fetch(url);
        const data = await res.json();
        setOrders(data.orders?? []);
        setLoading(false);
        setSearched(true)
    }

    useEffect(() => { fetchOrders() }, []);

    const search = async () => {
        fetchOrders(email.trim() || undefined);
    };

    const resendDownload = async (orderId: string) => {
        setResending(orderId);
        setMessage(null);
        const res = await fetch('/api/admin/resend-download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        })
        setMessage(
            res.ok
                ? { type: 'success', text: 'Download email sent successfully.' }
                : { type: 'error', text: 'Failed to send email. Check server logs.' }
        )
        setResending(null);
    }

    const logout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' })
        router.push('/admin/login')
    };

    return (
        <div className='min-h-screen bg-gray-50 p-6'>
            <div className='max-w-6xl mx-auto'>

                {/* Header */}
                <div className='flex items-center justify-between mb-8'>
                    <h1 className='text-2xl font-bold text-gray-900'>Rethinking Broken — Admin</h1>
                    <button onClick={logout} className='text-sm text-gray-500 hover:text-gray-700 underline'>
                        Log out
                    </button>
                </div>

                {/* Search */}
                <div className='flex gap-2 mb-4'>
                    <input
                        type='text'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && search()}
                        placeholder='Search by customer email'
                        className='flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black'
                    />
                    <button
                        onClick={search}
                        disabled={loading}
                        className='bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50'
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Status message */}
                {message && (
                    <div
                        className={`mb-4 px-4 py-2 rounded text-sm font-medium ${message.type === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Results table */}
                {orders.length > 0 && (
                    <div className='bg-white rounded-lg shadow overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-gray-100 text-gray-600 text-left'>
                                <tr>
                                    <th className='px-4 py-3 font-medium'>Order</th>
                                    <th className='px-4 py-3 font-medium'>Date</th>
                                    <th className='px-4 py-3 font-medium'>Customer</th>
                                    <th className='px-4 py-3 font-medium'>Product</th>
                                    <th className='px-4 py-3 font-medium'>Amount</th>
                                    <th className='px-4 py-3 font-medium'>Details</th>
                                    <th className='px-4 py-3 font-medium'>Action</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {orders.map(order => {
                                    const token = order.download_tokens?.[0]
                                    const expired = token ? isExpired(token.expires_at) : false
                                    const digital = isDigital(order.product_type)

                                    return (
                                        <tr key={order.id} className='hover:bg-gray-50 align-top'>
                                            <td className='px-4 py-3 font-mono text-gray-700'>#{order.order_number}</td>
                                            <td className='px-4 py-3 text-gray-600 whitespace-nowrap'>
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className='px-4 py-3'>
                                                <div className='font-medium text-gray-800'>{order.customer_name}</div>
                                                <div className='text-gray-500 text-xs'>{order.customer_email}</div>
                                            </td>
                                            <td className='px-4 py-3 capitalize text-gray-700'>{order.product_type}</td>
                                            <td className='px-4 py-3 text-gray-700 whitespace-nowrap'>
                                                {formatAmount(order.amount_total)}
                                            </td>
                                            <td className='px-4 py-3'>
                                                {digital && token ? (
                                                    <div className='text-xs'>
                                                        <span className={`font-medium ${expired ? 'text-red-600' : 'text-green-600'}`}>
                                                            {expired ? 'Expired' : 'Active'}
                                                        </span>
                                                        <span className='text-gray-500'> · expires {formatDate(token.expires_at)}</span>
                                                        <div className='text-gray-400 mt-0.5'>Downloaded {token.used_count}X</div>
                                                    </div>
                                                ) : digital && !token ? (
                                                    <span className='text-xs text-gray-400'>No token</span>
                                                ) : order.shipping_address ? (
                                                    <div className='text-xs text-gray-600'>
                                                        <div>{order.shipping_address.line1}</div>
                                                        {order.shipping_address.line2 && (
                                                            <div>{order.shipping_address.line2}</div>
                                                        )}
                                                        <div>
                                                            {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                                            {order.shipping_address.postal_code}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className='text-gray-400'>—</span>
                                                )}
                                            </td>
                                            <td className='px-4 py-3'>
                                                {digital && (
                                                    <button
                                                        onClick={() => resendDownload(order.id)}
                                                        disabled={resending === order.id}
                                                        className='bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap'
                                                    >
                                                        {resending === order.id ? 'Sending...' : 'Resend Download'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {searched && orders.length === 0 && (
                    <p className='text-gray-500 text-sm'>No orders found for "{email}".</p>
                )}
            </div>
        </div>
    )
}

export default AdminPage;