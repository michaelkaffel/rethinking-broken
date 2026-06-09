import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

const Home = () => {
    return (
        <>
            <div className='fixed inset-0 -z-10 bg-brand-dark-red speckled'/>
            <main>
                <Nav />
                <Hero />
            </main>
        </>

    );
};

export default Home;