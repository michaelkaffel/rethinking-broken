"use client";

import { useState } from 'react';

const Footer = () => {
    const [showPrivacy, setShowPrivacy] = useState(false);

    return (
        <>
            <footer className='relative z-10 bg-bg-deep border-t border-text-gold/10 py-6 px-8 lg:px-16'>
                <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-body text-text-light/40 text-sm'>

                    <p>
                        © {new Date().getFullYear()} Proudly created by{" "}
                        <a
                            href='https://owlchrysalismedicine.com'
                            target="_blank"
                            rel='noopener noreferrer'
                            className='hover:text-brand-yellow transition-colors'
                        >
                            Owl Medicine
                        </a>
                    </p>

                    <p>
                        <button
                            onClick={() => setShowPrivacy(true)}
                            className='underline underline-offset-4 hover:text-brand-yellow transition-colors'
                        >
                            Privacy Policy
                        </button>
                        {" · "}
                        Built by{" "}
                        <a
                            href="https://downbyriverdev.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-brand-yellow transition-colors'
                        >
                            Down by the River Development
                        </a>
                    </p>
                </div>
            </footer>

            {showPrivacy && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'
                    onClick={() => setShowPrivacy(false)}
                >
                    <div
                        className="relative bg-bg-deep border border-text-gold/20 max-w-lg w-full p-8 max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setShowPrivacy(false)}
                            className="absolute top-4 right-4 text-text-light/40 hover:text-brand-yellow transition-colors font-heading text-sm tracking-widest"
                        >
                            Close
                        </button>

                        <h2 className="font-heading text-2xl text-brand-yellow tracking-wide mb-4">
                            Privacy Policy
                        </h2>
                        <div className="w-10 h-px bg-text-gold mb-6" />

                        <div className="font-body text-text-light/70 space-y-4 text-sm leading-relaxed">
                            <p>
                                Rethinking Broken is committed to protecting your privacy. This policy outlines what information we collect and how it is used.
                            </p>
                            <h3 className="font-heading text-text-gold tracking-wide">What We Collect</h3>
                            <p>
                                When you subscribe to our newsletter, we collect your first name, last name, and email address. When you make a purchase, we collect the information necessary to fulfill your order.
                            </p>
                            <h3 className="font-heading text-text-gold tracking-wide">How We Use It</h3>
                            <p>
                                Your email address is used to send order confirmations, digital downloads, and — if you subscribe — our newsletter. We do not sell, rent, or share your personal information with third parties.
                            </p>
                            <h3 className="font-heading text-text-gold tracking-wide">Your Rights</h3>
                            <p>
                                You may unsubscribe from our newsletter at any time using the link included in every email. To request deletion of your data, contact us at{" "}
                                <a
                                    href="mailto:owlchrysalismedicine@gmail.com"
                                    className="underline underline-offset-4 hover:text-brand-yellow transition-colors"
                                >
                                    owlchrysalismedicine@gmail.com
                                </a>.
                            </p>
                            <h3 className="font-heading text-text-gold tracking-wide">Cookies</h3>
                            <p>
                                This site does not use tracking cookies or third-party analytics.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;