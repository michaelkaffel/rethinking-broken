const Contact = () => {
    return (
        <section id='contact' className='relative z-10 py-24 px-8 lg:px-16'>
            <div className='max-w-3xl mx-auto text-center'>

                <h2 className='font-heading text-4xl text-brand-yellow tracking-wide mb-4'>
                    Contact Us
                </h2>
                <div className='w-16 h-px bg-text-gold mx-auto mb-8'/>

                <p className='font-body text-text-light/70 mb-10'>
                    Learn more about the author{" "}
                    <a
                        href='https://owlchrysalismedicine.com/about'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-text-light/60 underline underline-offset-4 hover:text-brand-yellow transition-colors'
                    >
                        Owl Medicine
                    </a>
                    
                </p>

                <div className='flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-10 font-body text-text-light/60'>
                    <a
                        href='mailto:owlchrysalismedicine@gmail.com'
                        // className='hover:text-brand-yellow transition-colors'
                        className='px-8 py-3 bg-brand-yellow text-black font-heading text-sm tracking-widest hover:opacity-90 transition-opacity'
                    >
                        Contact via email
                    </a>
                    <span className='hidden md:block w-px h-4 bg-text-gold' />
                    <a
                        href='https://owlchrysalismedicine.com'
                        target='_blank'
                        rel='noopener noreferrer'
                        // className='hover:text-brand-yellow transition-colors'
                        className='px-8 py-3 bg-brand-yellow text-black font-heading text-sm tracking-widest hover:opacity-90 transition-opacity'
                    >
                        Other Offerings
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contact;