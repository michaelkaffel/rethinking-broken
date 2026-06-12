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

- [x] **Domain transfer initiated (Jun 8)** — Wix → Namecheap in progress (order #204754364, $11.68). Expected completion Jun 13-15. Direct Wix → Cloudflare not supported; Namecheap is intermediary. After 60 days, Namecheap → Cloudflare optional.
- [ ] **On transfer completion (~Jun 13-15)** — Point Namecheap nameservers to Cloudflare. Do NOT touch DNS records yet. Wix site stays live.
- [ ] **Cancel Wix Premium before Jun 27** — Wix Business plan renews Jun 27 (~$35). New site must be live and DNS flipped to Vercel before then.
- [ ] **Resend domain verification** — add Resend's DNS records to Cloudflare so emails send from `@rethinkingbroken.com`. Do early — DNS propagation takes time.
- [x] **Stripe account** — fresh account created (separate from old Wix-linked account). 4 products + shipping rate in test mode, all Price IDs in `.env.local` and Vercel env vars. Two webhook endpoints registered: local CLI + Vercel Production.
- [x] **Stripe CLI** — installed, confirmed working locally.
- [x] **Cloudflare R2 bucket** — `rethinking-broken-files` created (private). Both files uploaded: `rethinking-broken-ebook.pdf` (2.65MB) and `rethinking-broken-audiobook.zip` (866MB). API token created with Object Read & Write on this bucket.
- [x] **Supabase project** — created under "Down by the River Development" org. Schema run. `orders` starts at #11000.
- [x] **Phone number** — decided: Stripe Checkout will NOT collect phone number.
- [ ] **Tax awareness** — digital goods have sales tax obligations in some US states. Stripe Tax can automate this but costs extra. Be aware as volume grows.

---

## SEO Migration Checklist

### Before DNS cutover
- [ ] Crawl rethinkingbroken.com with Screaming Frog (free ≤500 URLs) — export all URLs, titles, meta descriptions
- [ ] Export Google Search Console top pages & queries
- [ ] Add per-page metadata (title, description, OG tags) using Next.js Metadata API
- [ ] Install and configure `next-sitemap` for `sitemap.xml` + `robots.txt`
- [ ] Add 301 redirects in `next.config.js` for any URL changes

### On launch
- [ ] Keep Wix live until DNS cutover
- [ ] DNS switch → submit sitemap to Google Search Console immediately
- [ ] Monitor Search Console for crawl errors 2–4 weeks post-launch

---

## Build Order

### ✅ Completed
1. Next.js project scaffold + GitHub + Vercel deploy
2. Home page — all sections built (Hero, Welcome, Testimonials, MoreFromAuthor, UpcomingEvents, NewsletterSignup, Contact, Footer)
3. Shop page — product grid with full-bleed banner, linked product cards
4. Product pages — `/shop/book` (with format toggle), `/shop/ebook`, `/shop/audiobook`
5. Shared components — Nav (sticky, scroll shadow, social icons hidden on mobile), Footer (privacy modal), BuyNowButton
6. Stripe — 4 products + shipping rate in dashboard, Price IDs wired to product pages, `/api/checkout` built and tested. Physical products collect US shipping address + $4.99 Media Mail flat rate.
7. Supabase — schema run (`orders` + `download_tokens`), `/api/webhooks/stripe` built and tested. Orders confirmed landing in DB on both local and deployed site. Download tokens generated for digital products.
8. Cloudflare R2 — private bucket created, both files uploaded, `/api/download` built and tested. Token validation, expiry check, presigned URL generation (15 min), and `attachment` download confirmed working.
9. Resend — `lib/email.ts` built with `sendDownloadEmail` (digital) and
   `sendShippingNotification` (physical → Owl + Michael). Wired into webhook
   handler. Stripe handles customer receipt. Tested end-to-end locally.
   Sending from `onboarding@resend.dev` until domain verified post-DNS cutover.

### 🔲 Up Next
10. Thank-you page with `/api/order` route + conditional download button
11. `/admin` route with order lookup and resend-link capability
12. Newsletter Signup API route (Resend audience)
13. Per-page SEO metadata + `next-sitemap`
14. Final end-to-end test in Stripe test mode
15. SEO audit: crawl new site vs. old
16. DNS cutover → submit sitemap → monitor → cancel Wix