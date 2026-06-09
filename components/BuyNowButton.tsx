"use client";

import { useState } from 'react';

interface Props {
    priceId: string,
    label?: string;
}

const BuyNowButton = ({ priceId, label = 'Buy Now'}: Props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClick = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ priceId }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No URL returned");
            }
        } catch {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>
            <button
                onClick={handleClick}
                disabled={loading}
                className='w-full py-4 bg-brand-yellow text-black font-heading text-sm tracking-widest hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50'
            >
                {loading ? 'Redirecting to checkout...' : label}
            </button>
            {error && (
                <p className='font-body text-brand-light text-sm mt-2'>{error}</p>
            )}
        </div>
    );
};

export default BuyNowButton;