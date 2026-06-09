"use client";

import { useState } from 'react';

const NewsletterSignup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Wire up Resend audience API todo
        // For now, simulate success
        setTimeout(() => setStatus('success'), 800);
    };

    return (
        <section className='relative z-10 bg-bg-deep py-24 px-8 lg:px-16'>
            <div className='max-w-7xl mx-auto'>
                <h2 className='font-heading text-4xl text-brand-yellow tracking-wide mb-4'>
                    Subscribe to our newsletter
                </h2>
                <div className='w-16 h-px bg-text-gold mb-8'/>

                {status === 'success' ? (
                    <p className='font-body text-text-light leading-relaxed'>
                        You&apos;re on the list. We&apos;ll be in touch.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>

                        <div className='flex flex-col md:flex-row gap-4'>
                            
                            <input 
                                type='text'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className='flex-1 bg-transparent border border-text-gold/20 px-4 py-3 font-body text-text-light placeholder:text-text-light/80 focus:outline-none focus:border-text-gold/60 transition-colors'
                                placeholder='Your first name'
                            />
                        
                            
                            <input 
                                type='text'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className='flex-1 bg-transparent border border-text-gold/20 px-4 py-3 font-body text-text-light placeholder:text-text-light/80 focus:outline-none focus:border-text-gold/60 transition-colors'
                                placeholder='Your last name'
                            />
                       
                           
                            <input 
                                type='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='flex-2 bg-transparent border border-text-gold/20 px-4 py-3 font-body text-text-light placeholder:text-text-light/80 focus:outline-none focus:border-text-gold/60 transition-colors'
                                placeholder='your@email.com'
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={status === 'loading'}
                            className='w-full my-4 py-3 bg-brand-yellow text-black font-heading text-sm tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50'
                        >
                            {status === 'loading' ? 'Joining...' : 'Join'}
                        </button>

                        {status === 'error' && (
                            <p className='font-body text-brand-red text-sm'>
                                Something went wrong. Please try again.
                            </p>
                        )}
                    </form>
                )}
                
            </div>

        </section>
    );
};

export default NewsletterSignup;