"use client";

import { useState } from 'react';

const NewsletterSignup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    // Client side sanitation
    const isValidEmailFormat = (val: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())

    const clearError = () => { if (status === 'error') setStatus('idle') }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim() || !isValidEmailFormat(email)) return;
        setStatus('loading');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                }),
            });

            if (res.ok) {
                setStatus('success');
                setFirstName('');
                setLastName('');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error')
        }
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
                                required
                                maxLength={100}
                                autoComplete='given-name'
                                onChange={(e) => {setFirstName(e.target.value); clearError() }}
                                className='flex-1 bg-transparent border border-text-gold/20 px-4 py-3 font-body text-text-light placeholder:text-text-light/80 focus:outline-none focus:border-text-gold/60 transition-colors'
                                placeholder='Your first name'
                            />
                        
                            
                            <input 
                                type='text'
                                required
                                maxLength={100}
                                autoComplete='family-name'
                                value={lastName}
                                onChange={(e) => {setLastName(e.target.value); clearError() }}
                                className='flex-1 bg-transparent border border-text-gold/20 px-4 py-3 font-body text-text-light placeholder:text-text-light/80 focus:outline-none focus:border-text-gold/60 transition-colors'
                                placeholder='Your last name'
                            />
                       
                           
                            <input 
                                type='email'
                                required
                                maxLength={254}
                                autoComplete='email'
                                value={email}
                                onChange={(e) => {setEmail(e.target.value); clearError() }}
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