import Image from "next/image";

const Hero = () => {
  return (
    <section>

      {/* Title block */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-8 py-16">
        <p className="italic text-lg tracking-widest mb-8 text-text-gold">
          Official Website of
        </p>

        <h1 className="font-heading text-center leading-none">
          <span
            className="block font-normal tracking-widest text-brand-yellow"
            style={{ fontSize: "clamp(3rem, 10vw, 10rem)" }}
          >
            RETHINKING
          </span>
          <span
            className="block font-normal tracking-widest"
            style={{ fontSize: "clamp(3rem, 10vw, 10rem)" }}
          >
            <span className="text-brand-yellow">BR</span>
            <span className="text-brand-red">OK</span>
            <span className="text-brand-yellow">EN</span>
          </span>
        </h1>
      </div>

      {/* Tagline image strip */}
      <div className="relative w-full h-72 overflow-hidden">
        <Image
          src="/hero-banner.png"
          alt="Person reading a book"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <p className="text-white text-3xl md:text-4xl italic text-center px-8 font-body">
            Trauma didn&apos;t Break You, it Trained You
          </p>
        </div>
      </div>

    </section>
  );
};

export default Hero;