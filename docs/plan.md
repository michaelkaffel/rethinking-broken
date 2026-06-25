# RethinkingBroken.com — Project Plan

---

## Site Structure

```
/ (home)
  ├── Hero
  ├── Welcome (book intro + CTA)
  ├── Testimonials (#testimonials anchor)
  ├── More from the Author
  ├── Upcoming Events
  ├── Newsletter Signup
  ├── Contact (#contact anchor)
  └── Footer

/shop
  ├── /shop/book        (Paperback / Hardcover toggle)
  ├── /shop/ebook
  └── /shop/audiobook

/thank-you?session_id={stripe_session_id}
  ├── Order summary
  └── Download button (digital products only)

/admin                  (password protected)
```

---

## Tech Stack

| Layer | Tool | Cost |
|---|---|---|
| Framework | **Next.js** (App Router) | Free |
| Hosting | **Vercel** | Free tier |
| Payments | **Stripe Checkout** (hosted) | 2.9% + 30¢/txn |
| Digital File Storage | **Cloudflare R2** | Free (10 GB) |
| Order Storage | **Supabase** (Postgres) | Free tier |
| Email | **Resend** | Free (3,000/mo) |

Total fixed monthly cost: **$0**

---

## Pre-Flight Checklist

- [x] **Domain transfer completed** — Wix → Namecheap confirmed active, expiry Dec 2027.
- [x] **Namecheap nameservers pointed to Cloudflare** — Updated to `jule.ns.cloudflare.com` / `tosana.ns.cloudflare.com`. Zone activated under Down by the River Development Cloudflare org. Wix A records and `www` CNAME preserved as DNS-only during transition.
- [ ] **Cancel Wix Premium before ~Jul 16** — Wix charges 14 days before the monthly renewal date (artifact of switching from yearly to monthly billing). New site must be live and DNS flipped to Vercel before then.
- [x] **Resend domain verification** — `rethinkingbroken.com` verified in Resend (us-east-1) via Cloudflare Domain Connect one-click auth. 3 DNS records scoped to `send` subdomain (MX, DKIM TXT, SPF TXT). Verified in ~3 minutes. Ready to send from `orders@rethinkingbroken.com`.
- [x] **Cloudflare Email Routing configured** — `orders@rethinkingbroken.com` forwarding to `owlchrysalismedicine@gmail.com`. **Pending: Owl must click the Cloudflare destination verification email to activate forwarding.**
- [x] **Stripe account** — Fresh account created (separate from old Wix-linked account). 4 products + shipping rate in test mode, all Price IDs in `.env.local` and Vercel env vars. Two webhook endpoints registered: local CLI + Vercel Production.
- [x] **Stripe CLI** — Installed, confirmed working locally.
- [x] **Cloudflare R2 bucket** — `rethinking-broken-files` created (private). Both files uploaded: `rethinking-broken-ebook.pdf` (2.65MB) and `rethinking-broken-audiobook.zip` (866MB). API token created with Object Read & Write on this bucket.
- [x] **Supabase project** — Created under "Down by the River Development" org. Schema run. `orders` starts at #11000.
- [x] **Phone number** — Decided: Stripe Checkout will NOT collect phone number.
- [ ] **Tax awareness** — Digital goods have sales tax obligations in some US states. Stripe Tax can automate this but costs extra. Be aware as volume grows.

---

## SEO Migration Checklist

### Before DNS cutover
- [ ] Crawl rethinkingbroken.com with Screaming Frog (free ≤500 URLs) — export all URLs, titles, meta descriptions
- [ ] Export Google Search Console top pages & queries
- [x] Add per-page metadata (title, description, OG tags) using Next.js Metadata API
- [x] `app/sitemap.ts` + `app/robots.ts` — built-in Next.js generation (no npm package needed)
- [ ] Add 301 redirects in `next.config.js` for any URL changes

### On launch
- [ ] Keep Wix live until DNS cutover
- [ ] DNS switch → submit sitemap to Google Search Console immediately
- [ ] Monitor Search Console for crawl errors 2–4 weeks post-launch

---

## Build Order

### ✅ Completed
1. Next.js project scaffold + GitHub + Vercel deploy
2. Home page — all sections built (Hero, Welcome, Testimonials, MoreFromAuthor, UpcomingEvents, NewsletterSignup, Contact, Footer). Testimonials rebuilt as a full carousel component (`components/Testimonials.tsx`) — 11 reviews (10 Amazon verified purchase + 1 Patreon member), auto-advance every 6 seconds (pauses on hover), prev/next SVG buttons, dot indicators, fixed container height to prevent layout shift from longer reviews.
3. Shop page — product grid with full-bleed banner, linked product cards
4. Product pages — `/shop/book` (with format toggle), `/shop/ebook`, `/shop/audiobook`
5. Shared components — Nav (sticky, scroll shadow, social icons hidden on mobile), Footer (privacy modal), BuyNowButton
6. Stripe — 4 products + shipping rate in dashboard, Price IDs wired to product pages, `/api/checkout` built and tested. Physical products collect US shipping address + $4.99 Media Mail flat rate.
7. Supabase — schema run (`orders` + `download_tokens`), `/api/webhooks/stripe` built and tested. Orders confirmed landing in DB on both local and deployed site. Download tokens generated for digital products.
8. Cloudflare R2 — private bucket created, both files uploaded, `/api/download` built and tested. Token validation, expiry check, presigned URL generation (15 min), and `attachment` download confirmed working.
9. Resend — `lib/email.ts` built and tested. `sendDownloadEmail` (digital) and `sendShippingNotification` (physical) wired into webhook handler. Domain verified — ready to send from `orders@rethinkingbroken.com`.
10. Thank-you page — `/thank-you?session_id=...` and `/api/order` built and tested. Order summary, conditional download button (digital), shipping address block (physical). Polling handles Stripe redirect/webhook race condition. 307 redirect from `/api/download` to R2 confirmed working end-to-end.
11. Admin panel — `proxy.ts` protects `/admin` routes. `/admin/login` password gate. `/admin` shows all orders by default, filterable by email. Shipping address visible for physical orders. Resend Download button generates fresh token + fires `sendDownloadEmail` for digital orders.
12. Newsletter signup — `app/api/newsletter/route.ts` built and tested. Accepts first name, last name, email. Server-side sanitization via `lib/sanitize.ts` (`sanitizeEmail` + `sanitizeName`). Adds contact to Resend audience via SDK. Confirmed working end-to-end — contacts landing in Resend Audience dashboard.
13. SEO metadata + sitemap — per-page `metadata` exports on all public pages. `app/sitemap.ts` + `app/robots.ts` (built-in Next.js, no npm package). noindex on `/thank-you` and `/admin/*` via `app/admin/layout.tsx`. OG image at `public/og-image.png`. `/shop/book` split into server wrapper (`page.tsx`) + `components/BookContent.tsx` (client) to allow metadata export. Favicon package generated via favicon.io and wired into root layout metadata. Supabase RLS enabled on both `orders` and `download_tokens` tables.

### ⚠️ Pre-Launch Blockers (must complete before Step 14)
- [ ] **Rename `middleware.ts` → `proxy.ts`** — Next.js 16 convention. Admin panel will not work without this.
- [ ] **Clean Supabase test data** — Delete `download_tokens` first, then `orders` (FK constraint order). Then run `ALTER TABLE orders ALTER COLUMN order_number RESTART WITH 11000` in SQL Editor to reset the sequence.
- [ ] **Update `RESEND_FROM_EMAIL`** — Set to `orders@rethinkingbroken.com` in both `.env.local` and Vercel env vars. Domain is verified; this is ready to flip.
- [ ] **Update `NEXT_PUBLIC_SITE_URL`** — Set to `https://rethinkingbroken.com` in Vercel env vars.
- [ ] **Redeploy** after env var updates.
- [ ] **Owl clicks Cloudflare verification email** — Required to activate `orders@rethinkingbroken.com` forwarding to his Gmail.

### 🔲 Up Next
14. Final end-to-end test in Stripe test mode — real email delivery, full purchase flow for all 4 product types
15. SEO audit: crawl new site with Screaming Frog vs. old Wix site
16. DNS cutover to Vercel → submit sitemap → monitor → cancel Wix

### 🔲 Post-Launch
- Domain registration transfer from Namecheap to Cloudflare registrar — available mid-August 2026 (ICANN 60-day lock after Wix → Namecheap transfer). Optional since Cloudflare already manages DNS.
- npm update (deferred from pre-launch; `npm` 10.9.2 → 11.17.0 and other deps)