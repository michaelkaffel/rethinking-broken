import Nav from "@/components/Nav"
import Hero from "@/components/Hero"
import Welcome from "@/components/Welcome";
import Testimonials from '@/components/Testimonials';
import MoreFromAuthor from '@/components/MoreFromAuthor';
import NewsletterSignup from '@/components/NewsletterSignup';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rethinking Broken | A Book by Owl Medicine',
    description: 'An honest, healing guide through childhood trauma by Owl. Available in paperback, hardcover, eBook, and audiobook.',
    openGraph: {
        title: 'Rethinking Broken | A Book by Owl Medicine',
        description: 'An honest, healing guide through childhood trauma by Owl.',
        url: '/',
    },
}

const Home = () => {
    return (
        <>
            <div className='fixed inset-0 -z-10 bg-brand-dark-red speckled'/>
            <main>
                <Nav />
                <Hero />
                <Welcome />
                <Testimonials />
                <MoreFromAuthor />
                <NewsletterSignup />
                <Contact />
                <Footer />
            </main>
        </>

    );
};

export default Home;