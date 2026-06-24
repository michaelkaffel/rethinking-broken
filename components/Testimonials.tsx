"use client";

import { useState, useEffect, useCallback } from 'react';

const testimonials = [
  {
    quote:
      "Understanding leads to compassion, and Rethinking Broken opens the door to having both of these experiences. This is a huge game changer and a gem of a read for anyone who is ready to face their trauma, reframe their self perception, and move into a life that is more enjoyable every day.",
    author: "Tammy",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote:
      "This is an extraordinary book I read and then referred to a few friends who all found it similarly remarkable. It's that good. For all people of all ages.",
    author: "Stuart McColl",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote:
      "This author does a brilliant job reframing the impact of trauma in a positive light: You aren't broken, you became a highly trained specialist in a totally inappropriate situation. Wish I had this book decades ago!",
    author: "Marcia G",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote:
      "This book offers real solutions that not only makes sense but they have worked for me. My life isn't the same as it was prior to reading this book. This book is a game changer and a fantastic read.",
    author: "Amazon Customer",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote:
      "No psycho babble, written from personal experience and insight. I think this will be a huge help to people affected by trauma.",
    author: "Mike",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote:
      "I'm an older lady — most people can't tell me something I don't know. This was a huge eye opener. So many of my toxic traits were pointed out. To not feel alone on my journey was most important to me. Love you Owl!",
    author: "Aimi",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote:
      "It isn't a self-help book saying 'You're perfect and the world has to deal with it!' It makes the reader think more about HOW a person ends up broken through trauma — so they come out the other side believing that broken isn't the end of their journey.",
    author: "Kindle Customer",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote:
      "It is incredible to read a unique twist on being from a damaging and broken childhood. Seeing yourself with gifts of super powers instead of worthless broken plates.",
    author: "Muriel Buckner",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote: "Appreciate the author's insight and experience shared.",
    author: "Sherg",
    detail: "★★★★★ Verified Purchase",
  },
  {
    quote: "Love the book!",
    author: "S.C.",
    detail: "★★★★★ Verified Purchase — Germany",
  },
  {
    quote:
      "Rethinking Broken has a wisdom and a practicality that cuts to the heart of the matter. I can't wait to read what's next and I'm already recommending the book to people who I know it will benefit.",
    author: "Eboney W.",
    detail: "Patreon Member",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = () => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length);
  const next = useCallback(() => setCurrent(i => (i + 1) % testimonials.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [paused, next]);

  const t = testimonials[current];

  return (
    <section id='testimonials' className='bg-bg-deep py-20 px-6'>
      <div
        className='max-w-3xl mx-auto text-center flex flex-col h-600px md:h-520px'
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <h2 className='text-3xl md:text-4xl font-heading text-brand-yellow mb-12'>
          What readers are saying
        </h2>

        {/* Quote area — grows to fill available space */}
        <div className='flex-1 flex flex-col items-center justify-center px-6 overflow-hidden'>
          <svg
            className='w-10 h-10 text-brand-yellow opacity-40 mb-4 shrink-0'
            fill='currentColor'
            viewBox='0 0 32 32'
            aria-hidden='true'
          >
            <path d='M10 8C5.6 8 2 11.6 2 16v8h8v-8H6c0-2.2 1.8-4 4-4V8zm14 0c-4.4 0-8 3.6-8 16v8h8v-8h-4c0-2.2 1.8-4 4-4V8z' />
          </svg>

          <p className='text-text-gold font-body text-lg md:text-xl italic leading-relaxed mb-6'>
            {t.quote}
          </p>

          <p className='text-brand-yellow font-heading text-base'>{t.author}</p>

          {t.detail && (
            <p className='text-text-gold/70 font-body text-sm mt-1'>{t.detail}</p>
          )}
        </div>

        {/* Controls row: prev | dots | next — always at the bottom */}
        <div className='flex items-center justify-center gap-4 mt-10'>
          <button
            onClick={prev}
            aria-label='Previous testimonial'
            className='p-2 text-brand-yellow opacity-60 hover:opacity-100 transition-opacity'
          >
            <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
              <polyline points='15 18 9 12 15 6' />
            </svg>
          </button>

          <div className='flex items-center gap-2' role='tablist' aria-label='Testimonial navigation'>
            {testimonials.map((_, i) => (
              <button
                key={i}
                role='tab'
                aria-selected={i === current}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-brand-yellow w-4'
                    : 'bg-brand-yellow/30 hover:bg-brand-yellow/60 w-2'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label='Next testimonial'
            className='p-2 text-brand-yellow opacity-60 hover:opacity-100 transition-opacity'
          >
            <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
              <polyline points='9 18 15 12 9 6' />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;