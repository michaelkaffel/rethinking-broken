const links = [
    {
        label: "Speak Plainly Podcast",
        description: "Honest conversations about mental health, trauma, and the biology of behaviour. New episodes on Spotify.",
        cta: "Listen Now",
        href: "https://owlchrysalismedicine.com/podcast",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
        ),
    },
    {
        label: "Articles by the Author",
        description: "Deep dives into the science of survival, adaptation, and what it really means to thrive after trauma.",
        cta: "Read Now",
        href: "https://owlchrysalismedicine.com/articles",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        ),
    },
];

const MoreFromAuthor = () => {
    return (
        <section className='relative z-10 py-24 px-8 lg:px-16'>
            <div className='max-w-7xl mx-auto'>

                <div className='text-center mb-16'>
                    <h2 className='font-heading text-4xl text-brand-yellow tracking-wide mb-4'>
                        More from the Author
                    </h2>
                    <div className='w-16 h-px bg-text-gold mx-auto' />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {links.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='group flex flex-col p-8 border border-text-gold/20 hover:border-text-gold/60 transition-colors duration-300'
                        >
                            <h3 className='font-heading text-xl text-brand-yellow tracking-wide mb-3'>
                                {item.label}
                            </h3>

                            <p className='font-body text-text-light leading-relaxed text-base flex-1'>
                                {item.description}
                            </p>

                            {/* CTA + Icon */}
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-2 text-text-gold font-heading text-sm tracking-widest group-hover:gap-4 transition-all duration-300">
                                    {item.cta}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-brand-yellow">
                                    {item.icon}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MoreFromAuthor;