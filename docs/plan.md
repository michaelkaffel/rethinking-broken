# RethinkingBroken.com — Project Plan

---

## Site Structure

```
/ (home)
  ├── Hero section
  ├── About / Book section
  ├── #testimonials  ← anchor
  └── #contact       ← anchor

/shop
  ├── Paperback
  ├── Hardcover
  ├── eBook (PDF)
  └── Audiobook (ZIP)

/thank-you?session_id={stripe_session_id}
  ├── Order summary
  └── Download button (digital products only)
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

## Pre-Flight: Before Writing Any Code

- [x] **Domain transfer initiated (Jun 8)** — Wix → Namecheap transfer paid and in progress (order #204754364, $11.68). Expected completion Jun 13-15. Note: Direct Wix → Cloudflare transfer is not supported; Namecheap is the intermediary. After 60 days Namecheap → Cloudflare is optional — Cloudflare DNS/R2/CDN all work immediately after pointing nameservers, regardless of who holds the registration.
- [ ] **On transfer completion (~Jun 13-15)** — Point Namecheap nameservers to Cloudflare. Do NOT touch DNS records yet — just nameservers. Wix site stays live.
- [ ] **Cancel Wix Premium before Jun 27** — Wix Business plan renews Jun 27 (~$35). New site must be live and DNS flipped to Vercel before then. Email Marketing is already auto-renew OFF. Domain registration at Wix renews Nov 10 — irrelevant since we're transferring away.
- [ ] **Resend domain verification** — add Resend's DNS records to Cloudflare so emails send from `@rethinkingbroken.com`. Do this early — DNS propagation takes time.
- [ ] **Stripe account** — confirm access, create 4 products, note each Price ID before building the checkout route.
- [ ] **Stripe CLI** — install locally for webhook testing during development (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`).
- [ ] **Cloudflare R2 bucket** — create it, set to private, upload both files, note bucket name and endpoint.
- [ ] **Supabase project** — create it, run schema SQL, copy connection string.
- [ ] **Phone number decision** — Stripe Checkout can optionally collect it. Current Wix flow does collect it. Decide yes/no before building the checkout session.
- [ ] **Tax awareness** — digital goods have sales tax obligations in some US states and countries. Stripe Tax can automate this but costs extra. Be aware as volume grows.
- [ ] **Order number continuity** — current Wix orders are at ~#10024. Set Supabase sequence to start at 11000: `ALTER SEQUENCE orders_order_number_seq RESTART WITH 11000;`

---

## SEO Migration Checklist

### Before writing any code
- [ ] Crawl rethinkingbroken.com with Screaming Frog (free ≤500 URLs) — export all URLs, titles, meta descriptions
- [ ] Export Google Search Console top pages & queries
- [ ] Note exact Wix URL slugs

### During build
- [ ] Match all existing URL paths exactly
- [ ] Next.js Metadata API for every page (title, description, OG tags)
- [ ] `next-sitemap` for `sitemap.xml` + `robots.txt`
- [ ] `next/image` for all images (Core Web Vitals impact)
- [ ] 301 redirects in `next.config.js` for any URLs that must change

### On launch
- [ ] Keep Wix live until DNS cutover
- [ ] DNS switch → submit sitemap to Google Search Console immediately
- [ ] Monitor Search Console for crawl errors 2–4 weeks post-launch

---

## Build Order

1. Next.js project scaffold + Vercel deploy + custom domain (DNS not yet switched)
2. Home page — visual match to current site, all anchor links working
3. Metadata, OG tags, `next-sitemap`
4. Stripe: create 4 products in dashboard, build `/api/checkout` route
5. Supabase: run schema, build webhook handler `/api/webhooks/stripe`
6. Cloudflare R2: upload files, configure CORS, build `/api/download` route
7. Resend: order confirmation email template + download link email template
8. Thank-you page with conditional download button
9. `/admin` route with resend-link capability
10. Full end-to-end test all 4 products in **Stripe test mode**
11. SEO audit: crawl new site vs. old
12. DNS cutover → submit sitemap → monitor
