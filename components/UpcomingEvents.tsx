const UpcomingEvents = () => {
    return (
        <section className='relative z-10 bg-brand-dark-red speckled py-24 px-8 lg:px-16'>
            <div className='max-w-7xl mx-auto text-center'>

                <h2 className='font-heading text-5xl lg:text-7xl text-text-light tracking-wide mb-6'>
                    Upcoming Events
                </h2>

                <div className='w-16 h-px bg-text-gold mx-auto mb-8' />

                <p className='font-body text-text-light/60 text-lg mb-10'>
                    Live workshops and speaking events are on the way.
                </p>

                <span className='inline-block px-8 py-3 border border-text-gold/40 font-heading text-sm tracking-widest text-text-gold/50 cursor-default'>
                    Coming Soon
                </span>

            </div>
        </section>
    );
};

export default UpcomingEvents;