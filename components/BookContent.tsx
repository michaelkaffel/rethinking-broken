"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BuyNowButton from '@/components/BuyNowButton';

const formats = [
    {
        label: "Paperback",
        price: "$19.99",
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PAPERBACK!,
    },
    {
        label: "Hardcover",
        price: "$28.99",
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_HARDCOVER!,
    },
];

const BookContent = () => {
    const [selected, setSelected] = useState(0);

    return (
        <>
            <div className='fixed inset-0 -z-10 bg-brand-dark-red speckled' />

            <main>
                <Nav />

                <section className='relative z-10 py-16 px-8 lg:px-16'>
                    <div className='max-w-7xl mx-auto'>

                        <h1 className='font-heading text-center text-4xl lg:text-5xl text-brand-yellow tracking-wide mb-10'>
                            Rethinking Broken
                        </h1>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-start'>

                            {/* Image — top on mobile, right on desktop */}
                            <div className='relative w-full aspect-3/4 lg:order-last'>
                                <Image
                                    src='/book-cover.png'
                                    alt='Rethinking Broken book cover'
                                    fill
                                    className='object-contain drop-shadow-2xl'
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>

                            {/* Details — below image on mobile, left on desktop */}
                            <div className='lg:order-first'>
                                <p className='font-body text-text-light/50 text-lg mb-6'>
                                    Childhood Trauma Didn&apos;t Break You
                                </p>
                                <div className='w-16 h-px bg-text-gold mb-8' />

                                <p className='font-body text-text-light/70 leading-relaxed text-lg mb-8'>
                                    Rethinking Broken is a raw, unflinching and scientific exploration of trauma, pain, and the resilience of the human spirit. Dive in to discover a biological blueprint for breaking free from the chains of self-doubt and the weight of past traumas.
                                </p>

                                <p className='font-body text-text-light/70 leading-relaxed text-lg mb-8'>
                                    Through candid stories, razor-sharp insights, and actionable steps, you&apos;ll learn to confront the paralyzing belief &quot;I&apos;m broken&quot; and replace it with empowering truths. By the end, you won&apos;t just understand your own resilience — you&apos;ll harness it.
                                </p>

                                <p className='font-body text-text-light/70 leading-relaxed text-lg mb-8'>
                                    Offering more than inspiration — this book provides the tools and strategies you need to reclaim your power, re-write your narrative, and re-shape your future. Your roadmap awaits within these pages.
                                </p>

                                <p className='font-body text-text-light/50 text-sm mb-3'>
                                    Format
                                </p>
                                <div className='flex gap-3 mb-8'>
                                    {formats.map((f, i) => (
                                        <button
                                            key={f.label}
                                            onClick={() => setSelected(i)}
                                            className={`px-6 py-2 font-heading text-sm tracking-widest border transition-colors duration-200 ${selected === i
                                                ? "bg-brand-yellow text-black border-brand-yellow"
                                                : "border-text-gold/40 text-text-gold hover:border-text-gold/70"
                                                }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>

                                <p className='font-heading text-3xl text-brand-yellow mb-8'>
                                    {formats[selected].price}
                                </p>

                                <BuyNowButton priceId={formats[selected].priceId} />

                                <p className='font-body text-text-light/80 text-sm mt-4'>
                                    Ships within 3-5 business days. Confirmation email with tracking included.
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 font-body text-text-light/50 text-sm hover:text-brand-yellow transition-colors mt-3"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                                    </svg>
                                    Back to Shop
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
};

export default BookContent;