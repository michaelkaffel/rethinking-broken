import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const products = [
    {
        id: "book",
        title: "Rethinking Broken",
        subtitle: "Paperback / Hardcover",
        price: "from $19.99",
        image: "/book-cover.png",
        alt: "Rethinking Broken book cover",
    },
    {
        id: "ebook",
        title: "Rethinking Broken",
        subtitle: "eBook — PDF",
        price: "$14.99",
        image: "/ebook-cover.png",
        alt: "Rethinking Broken eBook",
    },
    {
        id: "audiobook",
        title: "Rethinking Broken",
        subtitle: "Audiobook",
        price: "$21.99",
        image: "/audiobook-cover.png",
        alt: "Rethinking Broken Audiobook",
    },
];

const ShopPage = () => {
    return (
        <>
            <div className='fixed inset-0 -z-10 bg-brand-dark-red speckled' />

            <main>
                <Nav />

                <section className='relative z-10 py-20 px-8 lg:px-16'>
                    <div className='max-w-7xl mx-auto'>

                        <div className='relative w-full h-56 overflow-hidden mb-24'>
                            <Image 
                                src='/hero-banner.png'
                                alt='Rethinking Broken bookstore'
                                fill
                                className='object-cover object-top'
                                priority
                            />
                            <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
                                <h1 className='font-heading text-5xl text-brand-yellow tracking-wide'>
                                    The Bookstore
                                </h1>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            {products.map((p) => (
                                <div
                                    key={p.id}
                                    className='flex flex-col bg-text-gold/10 rounded p-2'
                                >

                                    <Link href={`/shop/${p.id}`} className='relative w-full aspect-3/4 overflow-hidden block'>

                                        <Image 
                                            src={p.image}
                                            alt={p.alt}
                                            fill
                                            className='object-cover transition-transform duration-500 hover:scale-105'
                                        />
                                    </Link>

                                    <div className='p-5 flex flex-col flex-1'>
                                        <h2 className='font-heading text-lg text-text-light tracking-wide'>
                                            {p.title}
                                        </h2>
                                        <p className='font-body text-text-light/50 text-sm mt-1 mb-4'>
                                            {p.subtitle}
                                        </p>

                                        <div className='flex items-center justify-between mt-auto'>
                                            <span className='font-heading text-brand-yellow text-lg'>
                                                {p.price}
                                            </span>
                                            <Link
                                                href={`/shop/${p.id}`}
                                                className='px-5 py-2 border border-text-gold/40 font-heading text-xs font-bold tracking-widest text-text-gold hover:bg-brand-yellow hover:text-black hover:border-brand-yellow transition-colors duration-200'
                                            >
                                                Details
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
};

export default ShopPage