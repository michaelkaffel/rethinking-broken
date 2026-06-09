import Image from "next/image";
import Link from "next/link";

const Welcome = () => {
    return (
        <section className='relative z-10 py-24 px-8 lg:px-16'>
            <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>

                <div>
                    <div className='w-16 h-px bg-text-gold mb-8' />

                    <div className='space-y-5 font-body leading-relaxed text-lg text-text-light'>
                        <p>
                            Surviving a stress-filled childhood changes you at a biological level.
                            The coping strategies you built weren&apos;t weaknesses — they were hard-won skills.
                        </p>
                        <p>
                            The problem? Without the right outlet, those same skills turn inward.
                            Self-sabotage. Catastrophizing. The quiet belief that something is
                            fundamentally wrong with you.
                        </p>
                        <p className="font-heading text-2xl text-brand-yellow">
                            Nothing is wrong with you.
                        </p>
                        <p>
                            Getting frustrated at yourself for not functioning like everyone else
                            is like getting angry at a goldfish for refusing to climb a tree.
                            The goldfish isn&apos;t broken. It just isn&apos;t designed to be an arborist.
                        </p>
                        <p>
                            You have a skill set that is not just useful — it&apos;s indispensable.
                            You don&apos;t need to fix yourself. You just need the right environment
                            to use what you already have.
                        </p>
                    </div>

                    <Link
                        href="/shop"
                        className='inline-block mt-10 px-8 py-3 bg-brand-yellow text-black font-heading text-sm tracking-widest hover:opacity-90 transition-opacity'
                    >
                        Get the Book
                    </Link>
                </div>

                <div className='relative flex items-center justify-center overflow-hidden'>

                    <div className='absolute w-80 h-80 rounded-full bg-brand-yellow opacity-10 blur-3xl' />

                    <div className='relative w-full max-w-sm aspect-[3/4]'>
                        <Image 
                            src="/book-cover.png"
                            alt="Rethinking Broken — 3D book cover"
                            fill
                            className='object-contain drop-shadow-2xl'
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Welcome;