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

- [x] **Domain transfer initiated (Jun 8)** — Wix → Namecheap in progress (order #204754364, $11.68). Expected completion Jun 13-15. Direct Wix → Cloudflare not supported; Namecheap is intermediary. After 60 days, Namecheap → Cloudflare optional — Cloudflare DNS/R2/CDN work immediately after pointing nameservers.
- [ ] **On transfer completion (~Jun 13-15)** — Point Namecheap nameservers to Cloudflare. Do NOT touch DNS records yet. Wix site stays live.
- [ ] **Cancel Wix Premium before Jun 27** — Wix Business plan renews Jun 27 (~$35). New site must be live and DNS flipped to Vercel before then.
- [ ] **Resend domain verification** — add Resend's DNS records to Cloudflare so emails send from `@rethinkingbroken.com`. Do early — DNS propagation takes time.
- [ ] **Stripe account** — confirm access, create 4 products (paperback, hardcover, ebook, audiobook), note each Price ID.
- [ ] **Stripe CLI** — install locally (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`).
- [ ] **Cloudflare R2 bucket** — create, set to private, upload both files, note bucket name and endpoint.
- [ ] **Supabase project** — create, run schema SQL, copy connection string.
- [ ] **Phone number** — decided: Stripe Checkout will NOT collect phone number.
- [ ] **Tax awareness** — digital goods have sales tax obligations in some US states. Stripe Tax can automate this but costs extra. Be aware as volume grows.
- [ ] **Order number continuity** — Wix orders currently at ~#10024. Set Supabase sequence to start at 11000: `ALTER SEQUENCE orders_order_number_seq RESTART WITH 11000;`

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
3. Shop page — product grid with banner, linked product cards
4. Product pages — `/shop/book` (with format toggle), `/shop/ebook`, `/shop/audiobook`
5. Shared components — Nav (sticky, scroll shadow), Footer (privacy modal), BuyNowButton

### 🔲 Up Next
6. Stripe: create products in dashboard, replace placeholder Price IDs, build `/api/checkout`
7. Supabase: run schema, build `/api/webhooks/stripe`
8. Cloudflare R2: upload files, configure CORS, build `/api/download`
9. Resend: order confirmation + download link email templates
10. Thank-you page with conditional download button
11. `/admin` route with order lookup and resend-link capability
12. Newsletter Signup API route (Resend audience)
13. Per-page SEO metadata + `next-sitemap`
14. Full end-to-end test in **Stripe test mode**
15. SEO audit: crawl new site vs. old
16. DNS cutover → submit sitemap → monitor → cancel Wix