import Nav from "@/components/Nav"
import Hero from "@/components/Hero"
import Welcome from "@/components/Welcome";
import Testimonials from '@/components/Testimonials';
import MoreFromAuthor from '@/components/MoreFromAuthor';

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
            </main>
        </>

    );
};

export default Home;