"use client";

import { useState } from "react";

const Footer = () => {
    const [showPrivacy, setShowPrivacy] = useState(false);

    return (
        <>
            <footer className="relative z-10 bg-bg-deep border-t border-text-gold/10 py-6 px-8 lg:px-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-body text-text-light/40 text-sm">

                    {/* Left: social icons + privacy policy */}
                    <div className="flex items-center gap-6">
                        <a href="http://www.facebook.com/owlchrysalismedicine/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 hover:text-brand-yellow transition-colors">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/owlcmedicine/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 hover:text-brand-yellow transition-colors">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                        </a>
                        <span className="w-px h-4 bg-text-gold/20" />
                        <button
                            onClick={() => setShowPrivacy(true)}
                            className="underline underline-offset-4 hover:text-brand-yellow transition-colors"
                        >
                            Privacy Policy
                        </button>
                    </div>

                    {/* Center: copyright */}
                    <p className="text-center">
                        © {new Date().getFullYear()} Proudly created by{" "}
                        <a
                            href="https://owlchrysalismedicine.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand-yellow transition-colors"
                        >
                            Owl Medicine
                        </a>
                    </p>

                    {/* Right: built by */}
                    <p>
                        Built by{" "}
                        <a
                            href="https://downbyriverdev.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand-yellow transition-colors"
                        >
                            Down by the River Development
                        </a>
                    </p>

                </div>
            </footer>

            {/* Privacy Policy Modal */}
            {showPrivacy && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                    onClick={() => setShowPrivacy(false)}
                >
                    <div
                        className="relative bg-bg-deep border border-text-gold/20 max-w-lg w-full p-8 max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                            <p>Rethinking Broken is committed to protecting your privacy. This policy outlines what information we collect and how it is used.</p>
                            <h3 className="font-heading text-text-gold tracking-wide">What We Collect</h3>
                            <p>When you subscribe to our newsletter, we collect your first name, last name, and email address. When you make a purchase, we collect the information necessary to fulfill your order.</p>
                            <h3 className="font-heading text-text-gold tracking-wide">How We Use It</h3>
                            <p>Your email address is used to send order confirmations, digital downloads, and — if you subscribe — our newsletter. We do not sell, rent, or share your personal information with third parties.</p>
                            <h3 className="font-heading text-text-gold tracking-wide">Your Rights</h3>
                            <p>
                                You may unsubscribe from our newsletter at any time using the link included in every email. To request deletion of your data, contact us at{" "}
                                <a href="mailto:owlchrysalismedicine@gmail.com" className="underline underline-offset-4 hover:text-brand-yellow transition-colors">
                                    owlchrysalismedicine@gmail.com
                                </a>.
                            </p>
                            <h3 className="font-heading text-text-gold tracking-wide">Cookies</h3>
                            <p>This site does not use tracking cookies or third-party analytics.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;