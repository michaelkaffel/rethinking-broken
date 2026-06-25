# RethinkingBroken.com — Project Plan

---

## Site Structure

/
  home
  Hero
  Welcome (book intro + CTA)
  Testimonials (#testimonials anchor)
  More from the Author
  Upcoming Events
  Newsletter Signup
  Contact (#contact anchor)
  Footer

/shop
  /shop/book        (Paperback / Hardcover toggle)
  /shop/ebook
  /shop/audiobook

/thank-you?session_id={stripe_session_id}
  Order summary
  Download button (digital products only)

/admin (password protected)

---

## Tech Stack

| Layer | Tool | Cost |
|---|---|---|
| Framework | Next.js (App Router) | Free |
| Hosting | Vercel | Free tier |
| Payments | Stripe Checkout (hosted) | 2.9% + 30c/txn |
| Digital File Storage | Cloudflare R2 | Free (10 GB) |
| Order Storage | Supabase (Postgres) | Free tier |
| Email | Resend | Free (3,000/mo) |

Total fixed monthly cost: $0

---

## Pre-Flight Checklist

- [x] Domain transfer — Wix to Namecheap (intermediary) to Cloudflare DNS. Cloudflare manages DNS for rethinkingbroken.com. Full registrar transfer to Cloudflare available mid-August 2026 (ICANN 60-day lock).
- [x] Wix — cancel before ~Jul 16 (Business plan renewal ~$35).
- [x] Resend domain verification — orders@rethinkingbroken.com verified via Cloudflare Domain Connect. Cloudflare Email Routing configured to forward orders@ to Owl's Gmail (pending Owl's one-time verification click).
- [x] Stripe account — fresh account. 4 products + shipping rate created in live mode (copied from test mode). All Price IDs in Vercel env vars. Live webhook endpoint registered at https://rethinkingbroken.com/api/webhooks/stripe. Secret key rotated Jun 25 2026 (old key accidentally placed in NEXT_PUBLIC_ env var — rotated immediately, no unauthorized use detected).
- [x] Cloudflare R2 bucket — rethinking-broken-files created (private). Both files uploaded: rethinking-broken-ebook.pdf (2.65MB) and rethinking-broken-audiobook.zip (866MB). API token created with Object Read & Write on this bucket.
- [x] Supabase project — created under Down by the River Development org. Schema run. orders starts at 11000.
- [x] Phone number — decided: Stripe Checkout will NOT collect phone number.
- [ ] Tax awareness — digital goods have sales tax obligations in some US states. Stripe Tax can automate this but costs extra. Be aware as volume grows.

---

## SEO Migration Checklist

### Before DNS cutover
- [x] Crawl rethinkingbroken.com with Screaming Frog — skipped (small site, no legacy URL changes needed)
- [x] Add per-page metadata (title, description, OG tags) using Next.js Metadata API
- [x] app/sitemap.ts + app/robots.ts — built-in Next.js generation (no npm package needed)
- [x] No URL changes — no 301 redirects needed

### On launch
- [x] DNS switched to Vercel Jun 25 2026
- [x] Sitemap submitted to Google Search Console — https://rethinkingbroken.com/sitemap.xml — 5 pages discovered
- [x] Google Search Console property verified (Domain property via Cloudflare OAuth) under Owl's account. michaeldkaffel@gmail.com invited.
- [ ] Monitor Search Console for crawl errors 2-4 weeks post-launch

---

## Build Order

### Completed
1. Next.js project scaffold + GitHub + Vercel deploy
2. Home page — all sections built (Hero, Welcome, Testimonials, MoreFromAuthor, UpcomingEvents, NewsletterSignup, Contact, Footer)
3. Shop page — product grid with full-bleed banner, linked product cards
4. Product pages — /shop/book (with format toggle), /shop/ebook, /shop/audiobook
5. Shared components — Nav (sticky, scroll shadow, social icons hidden on mobile), Footer (privacy modal), BuyNowButton
6. Stripe — 4 products + shipping rate in dashboard, Price IDs wired to product pages, /api/checkout built and tested. Physical products collect US shipping address + $4.99 Media Mail flat rate.
7. Supabase — schema run (orders + download_tokens), /api/webhooks/stripe built and tested. Orders confirmed landing in DB on both local and deployed site. Download tokens generated for digital products.
8. Cloudflare R2 — private bucket created, both files uploaded, /api/download built and tested. Token validation, expiry check, presigned URL generation (15 min), and attachment download confirmed working.
9. Resend — lib/email.ts built and tested. sendDownloadEmail (digital) and sendShippingNotification (physical) wired into webhook handler. Sending from orders@rethinkingbroken.com (domain verified).
10. Thank-you page — /thank-you?session_id=... and /api/order built and tested. Order summary, conditional download button (digital), shipping address block (physical). Polling handles Stripe redirect/webhook race condition. 307 redirect from /api/download to R2 confirmed working end-to-end.
11. Admin panel — proxy.ts protects /admin routes. /admin/login password gate. /admin shows all orders by default, filterable by email. Shipping address visible for physical orders. Resend Download button generates fresh token + fires sendDownloadEmail for digital orders.
12. Newsletter signup — app/api/newsletter/route.ts built and tested. Accepts first name, last name, email. Server-side sanitization via lib/sanitize.ts (sanitizeEmail + sanitizeName). Adds contact to Resend audience via SDK. Confirmed working end-to-end.
13. SEO metadata + sitemap — per-page metadata exports on all public pages. app/sitemap.ts + app/robots.ts (built-in Next.js, no npm package). noindex on /thank-you and /admin/* via app/admin/layout.tsx. OG image at public/og-image.png. /shop/book split into server wrapper (page.tsx) + components/BookContent.tsx (client) to allow metadata export.
14. Final end-to-end test — all 4 product types (ebook, audiobook, paperback, hardcover) passed in Stripe test mode. middleware.ts renamed to proxy.ts. Test data cleaned. Env vars confirmed.
15. SEO audit — skipped (small site, no legacy URL changes).
16. DNS cutover Jun 25 2026 — Cloudflare DNS updated (Wix A records + www CNAME removed; Vercel CNAME records added for apex and www). Stripe switched to live mode. Google Search Console verified + sitemap submitted. Supabase test data wiped, order sequence reset to 11000.

### Post-Launch
- [ ] Remind Owl to click Cloudflare verification email to activate orders@rethinkingbroken.com forwarding to Gmail
- [ ] Cancel Wix Premium before ~Jul 16
- [ ] Domain registration transfer Namecheap to Cloudflare registrar (available mid-August 2026, ICANN lock)
- [ ] npm update — deferred until post-launch
- [ ] Monitor Search Console for crawl errors 2-4 weeks post-launch