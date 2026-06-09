const testimonials = [
  {
    quote:
      "I used to think I needed to heal all of my trauma before I could succeed. Now I am beginning to see how I can use my trauma in ways that benefit my life. Rethinking Broken has given me the tools to re-frame how I look at my issues and turn them into superpowers. I'm very excited for the rest of the world to receive this gem!",
    name: "Tammy B.",
    title: "Beta Reader",
  },
  {
    quote:
      "I've received many unexpected gifts as a Patreon member. The drafts themselves have been filled with empathy and hope. Rethinking Broken has a wisdom and practicality that cuts to the heart of the matter. I can't wait to read what's next — and I'm already recommending it to everyone I know it will benefit.",
    name: "Eboney W.",
    title: "Patreon Member",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative z-10 bg-bg-deep py-24 px-8 lg:px-16">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl text-brand-yellow tracking-wide mb-4">
            Reviews
          </h2>
          <div className="w-16 h-px bg-text-gold mx-auto" />
        </div>

        {/* Stacked cards */}
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-8 border border-text-gold/20 rounded-sm"
            >
              {/* Quote mark */}
              <span className="font-heading text-6xl text-brand-yellow/30 leading-none mb-4">
                &ldquo;
              </span>

              <p className="font-body text-text-light leading-relaxed text-lg flex-1">
                {t.quote}
              </p>

              {/* Divider + attribution */}
              <div className="mt-8">
                <div className="w-10 h-px bg-text-gold mb-4" />
                <p className="font-heading text-text-gold text-sm tracking-widest">
                  {t.name}
                </p>
                <p className="font-body text-text-light/50 text-sm mt-1">
                  {t.title}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;