# RethinkingBroken.com — Technical Reference

---

## ⚠️ Why the 827 MB Audiobook Dictates the Download Architecture

Vercel serverless functions have a **4.5 MB response size limit** and **10-second execution timeout** on the free tier. Proxying an 827 MB file through Vercel will fail every time.

**Solution: Cloudflare R2 Presigned URLs**

The download link redirects **directly to Cloudflare R2**, bypassing Vercel entirely. Vercel only generates the signed URL — it never touches the file bytes.

```
User clicks Download
        │
        ▼
/api/download?token=<uuid>    ← Vercel (validates token only, ~10ms)
        │
        ▼
302 Redirect to R2 Presigned URL  ← Cloudflare CDN serves the file
        │
        ▼
File downloads at full CDN speed
```

**File sizes:**
- eBook PDF: 2.5 MB
- Audiobook ZIP: 827 MB

---

## Product Pages

| Route | Component | Notes |
|---|---|---|
| `/shop/book` | `app/shop/book/page.tsx` + `components/BookContent.tsx` | Server wrapper exports metadata; `BookContent.tsx` (`"use client"`) handles paperback/hardcover toggle via `useState` |
| `/shop/ebook` | `app/shop/ebook/page.tsx` | Server component |
| `/shop/audiobook` | `app/shop/audiobook/page.tsx` | Server component |

**Shared component:** `components/BuyNowButton.tsx` — client component that POSTs to `/api/checkout` with a `priceId` and redirects to the returned Stripe Checkout URL. Handles loading and error states.

**Price ID wiring:**
- `/shop/book` is a client component — uses `NEXT_PUBLIC_STRIPE_PRICE_PAPERBACK` and `NEXT_PUBLIC_STRIPE_PRICE_HARDCOVER`
- `/shop/ebook` and `/shop/audiobook` are server components — use `STRIPE_PRICE_EBOOK` and `STRIPE_PRICE_AUDIOBOOK` directly

---

## Purchase Flows

### Digital Products (eBook / Audiobook)

```
1. Customer clicks Buy Now → POST /api/checkout { priceId }
2. /api/checkout creates Stripe Checkout Session → returns { url }
3. Browser redirects to Stripe hosted checkout
4. Payment succeeds → Stripe fires webhook → /api/webhooks/stripe
5. Webhook handler:
   a. Creates order record in Supabase
   b. Generates download token (UUID) with 30-day expiry
   c. Sends download link email via Resend
6. Stripe redirects customer to /thank-you?session_id={id}
7. Thank-you page calls /api/order?session_id={id}
   → Returns order info + download URL
   → Shows order summary + Download button
```

### Physical Books (Paperback / Hardcover)

```
1. Customer selects format → clicks Buy Now → POST /api/checkout { priceId }
2. /api/checkout creates Stripe Checkout Session → returns { url }
3. Browser redirects to Stripe hosted checkout — collects shipping address + $4.99 Media Mail
4. Payment succeeds → Stripe fires webhook → /api/webhooks/stripe
5. Webhook handler:
   a. Creates order record in Supabase (shipping_address stored as JSONB)
   b. Sends shipping notification to Owl + Michael via Resend
6. Stripe redirects to /thank-you?session_id={id}
7. Thank-you page shows order summary (no download button)
```

> **Key principle:** The webhook is the source of truth. Emails and tokens always originate from the webhook, never from the thank-you page load.

---

## Shipping

- **Physical products only** (paperback, hardcover)
- **US only** for now
- **Flat rate:** $4.99 Media Mail (3–5 business days)
- Shipping rate created in Stripe Dashboard, referenced via `STRIPE_SHIPPING_RATE_ID`
- `shipping_address_collection` + `shipping_options` both set in checkout session for physical products

---

## Email Templates

### Download Link Email (digital only)
- **Subject:** `Your download link is ready (#XXXXX)`
- **Sent by:** `lib/email.ts` → `sendDownloadEmail`
- **From:** `orders@rethinkingbroken.com` via Resend (currently `onboarding@resend.dev` until domain verified)

### Shipping Notification (physical only)
- **Subject:** `New order to ship — #XXXXX (Format)`
- **Sent by:** `lib/email.ts` → `sendShippingNotification`
- **To:** `OWL_NOTIFICATION_EMAIL` + `MY_NOTIFICATION_EMAIL`

### Order Confirmation (all products)
- Handled automatically by Stripe (Settings → Customer emails → Successful payments: ON)
- Note: Stripe does not send receipts for test mode charges — works in live mode only

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/checkout` | POST | Creates Stripe Checkout Session, returns `{ url }` |
| `/api/webhooks/stripe` | POST | Handles `checkout.session.completed` event |
| `/api/order` | GET | Returns order info by `session_id` for thank-you page |
| `/api/download` | GET | Validates token, redirects to R2 presigned URL |
| `/api/newsletter` | POST | Sanitizes input, adds contact to Resend audience via SDK |
| `/api/admin/login` | POST | Validates `ADMIN_SECRET`, sets httpOnly cookie |
| `/api/admin/logout` | POST | Clears admin cookie |
| `/api/admin/orders` | GET | Returns all orders or filters by email (`?email=`) |
| `/api/admin/resend-download` | POST | Generates new token + sends download email |

### The one Stripe event you care about
```javascript
if (event.type === 'checkout.session.completed') {
  const session = event.data.object
  if (session.payment_status === 'paid') {
    // do everything here
  }
}
```

---

## SEO

### Approach
No npm packages. Next.js App Router has built-in support for all three concerns:
- **Per-page metadata** — `export const metadata: Metadata = { ... }` in each page file
- **Sitemap** — `app/sitemap.ts` → served at `/sitemap.xml`
- **Robots** — `app/robots.ts` → served at `/robots.txt`

### Metadata structure

```
app/layout.tsx          ← metadataBase + default title template + default description + OG/Twitter defaults
app/page.tsx            ← home (absolute title — bypasses template)
app/shop/page.tsx       ← shop index
app/shop/book/page.tsx  ← book (server wrapper — required so metadata can be exported)
app/shop/ebook/page.tsx
app/shop/audiobook/page.tsx
app/thank-you/page.tsx  ← robots: noindex/nofollow
app/admin/layout.tsx    ← robots: noindex/nofollow (covers all /admin/* routes)
```

### Title template
Set in root layout:
```typescript
title: {
  default: 'Rethinking Broken | A Book by Owl',
  template: '%s | Rethinking Broken',
}
```
- Pages that set `title: 'Shop'` render as `Shop | Rethinking Broken`
- Home page sets an absolute string, bypassing the template

### OG image
Stored at `public/og-image.png` (1200×630px). Wired in root layout:
```typescript
openGraph: {
  images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rethinking Broken by Owl' }],
},
twitter: {
  card: 'summary_large_image',
  images: ['/og-image.png'],
},
```
`metadataBase` in root layout resolves `/og-image.png` → `https://rethinkingbroken.com/og-image.png`.

### noindex pages
`/thank-you` and all `/admin/*` routes are excluded from search engines:
```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}
```
`app/admin/layout.tsx` covers the entire admin section in one file rather than adding noindex to each admin page individually.

---

## Newsletter Signup

**Route:** `app/api/newsletter/route.ts`
**Component:** `components/NewsletterSignup.tsx` (client component)
**Sanitization:** `lib/sanitize.ts`

Accepts `{ firstName, lastName, email }`. All three fields are required.

### Sanitization layers

| Layer | Purpose |
|---|---|
| Component | UX only — `type="email"`, `maxLength`, format check before fetch. Trivially bypassed; not a security boundary. |
| `lib/sanitize.ts` | Server-side truth — strips control chars + HTML tags from names; validates email against RFC 5322-ish regex with length cap. |
| Route | Content-type check, body shape validation, null checks on sanitizer return values. |

**`sanitizeEmail`** — trims, lowercases, strips control chars, validates format + RFC 5321 max length (254). Returns `string | null`.

**`sanitizeName`** — trims, strips control chars (`\x00–\x1F`, `\x7F`) and HTML tags (`<[^>]*>`), collapses internal whitespace. Permissive by design — supports accented, hyphenated, and Unicode names. Returns `string | null`. Accepts optional `required` param (default `true`).

### Resend integration
Uses the **Resend SDK** (`resend.contacts.create`) — not raw fetch. Already-subscribed contacts (error name `already_exists`) are treated as success.

---

## Download Token Logic

```sql
CREATE TABLE download_tokens (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid REFERENCES orders(id),
  product_type  text,
  token         uuid UNIQUE DEFAULT gen_random_uuid(),
  expires_at    timestamptz DEFAULT now() + interval '30 days',
  used_count    integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
```

When `/api/download?token=<uuid>` is called:
1. Look up token in DB
2. Check `expires_at` — return 410 Gone if expired
3. Generate a **short-lived R2 presigned URL** (15 min) with `ResponseContentDisposition: attachment; filename="Rethinking-Broken-{type}.{ext}"` to force download (not inline display)
4. Increment `used_count` (audit only — re-downloads within 30 days allowed)
5. 302 redirect to presigned URL

---

## Admin Panel

Password-protected at `/admin`. Protected by `proxy.ts` checking `ADMIN_SECRET` cookie.

```
/admin
  └── Shows all orders by default (newest first)
      └── Filter by customer email via search box
          └── Table: order #, date, customer name/email, product, amount
              ├── Physical orders: shipping address in Details column
              └── Digital orders: token status/expiry/used count + [Resend Download Email] button
                  → Generates new token (fresh 30-day window)
                  → Calls sendDownloadEmail
```

**Auth flow:**
- `proxy.ts` matches `/admin/:path*` and `/api/admin/:path*`
- Exempts `/admin/login` and `/api/admin/login`
- Checks `admin_token` cookie value against `ADMIN_SECRET`
- Missing/wrong cookie → redirect to `/admin/login` (pages) or 401 (API routes)
- Cookie is httpOnly, secure in production, 7-day maxAge

---

## Supabase Schema

```sql
CREATE TABLE orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz DEFAULT now(),
  stripe_session_id text UNIQUE,
  order_number      integer GENERATED ALWAYS AS IDENTITY (START WITH 11000),
  customer_email    text,
  customer_name     text,
  product_type      text,  -- 'paperback'|'hardcover'|'ebook'|'audiobook'
  amount_total      integer,  -- in cents
  shipping_address  jsonb  -- physical orders only
);

CREATE TABLE download_tokens (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid REFERENCES orders(id),
  product_type  text,
  token         uuid UNIQUE DEFAULT gen_random_uuid(),
  expires_at    timestamptz DEFAULT now() + interval '30 days',
  used_count    integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
```

---

## Security Checklist

- [x] `STRIPE_SECRET_KEY` only in server-side API routes — never in client components or `NEXT_PUBLIC_` vars
- [x] Webhook handler verifies Stripe signature with `stripe.webhooks.constructEvent()`
- [x] R2 bucket is **fully private** — Public Access: Disabled confirmed in dashboard
- [x] All download links are server-generated presigned URLs — never a static R2 path
- [x] Download tokens are UUIDs — not derived from any order data
- [x] Presigned URLs short-lived (15 min) even though tokens are valid 30 days
- [x] `/admin` protected by `proxy.ts` checking `ADMIN_SECRET` httpOnly cookie
- [x] Newsletter input sanitized server-side (`lib/sanitize.ts`) — strips HTML tags, control chars, enforces length limits
- [x] All secrets in `.env.local` — never in Git
- [x] `.env.local` in `.gitignore` from day one
- [x] HTTPS automatic on Vercel

---

## Environment Variables

```bash
# .env.local — never commit this file

# Stripe
STRIPE_SECRET_KEY=sk_test_...           # swap to sk_live_ on launch
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs
STRIPE_PRICE_PAPERBACK=price_...
STRIPE_PRICE_HARDCOVER=price_...
STRIPE_PRICE_EBOOK=price_...
STRIPE_PRICE_AUDIOBOOK=price_...

# Used by /shop/book (client component — must be NEXT_PUBLIC_)
NEXT_PUBLIC_STRIPE_PRICE_PAPERBACK=price_...   # same value as STRIPE_PRICE_PAPERBACK
NEXT_PUBLIC_STRIPE_PRICE_HARDCOVER=price_...   # same value as STRIPE_PRICE_HARDCOVER

# Stripe Shipping
STRIPE_SHIPPING_RATE_ID=shr_...         # $4.99 Media Mail, US only

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_... # server-side only, never NEXT_PUBLIC_

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=rethinking-broken-files
R2_EBOOK_KEY=rethinking-broken-ebook.pdf
R2_AUDIOBOOK_KEY=rethinking-broken-audiobook.zip

# Resend
RESEND_API_KEY=re_...
RESEND_AUDIENCE_ID=...                  # from Resend dashboard → Audience URL
RESEND_FROM_EMAIL=onboarding@resend.dev # swap to orders@rethinkingbroken.com after domain verified
OWL_NOTIFICATION_EMAIL=owlchrysalismedicine@gmail.com
MY_NOTIFICATION_EMAIL=michaelk.ocm@gmail.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # swap to https://rethinkingbroken.com after DNS cutover

# Admin
ADMIN_SECRET=...  # generate with: openssl rand -hex 32
```

All of the above get added to the Vercel dashboard under Environment Variables — never to your repo.

---

## Key Gotchas

- Client components can't read unprefixed `process.env` — `/shop/book` uses `NEXT_PUBLIC_STRIPE_PRICE_*`
- `req.text()` required for webhook signature verification (not `req.json()`)
- Vercel needs a separate Stripe webhook endpoint from the local CLI one
- 827MB audiobook requires AWS CLI + R2 S3-compatible endpoint for upload (browser upload limit is 300MB)
- `ResponseContentDisposition: attachment` needed on presigned URL to force download vs inline display
- **Stripe API `2026-05-27.dahlia`** — shipping address is at `session.collected_information.shipping_details.address`, NOT `session.shipping_details.address`
- `useSearchParams()` requires a Suspense boundary in Next.js App Router — split into server wrapper (`page.tsx`) and client component (`ThankYouContent.tsx`)
- **Next.js 16** — `middleware.ts` is deprecated, use `proxy.ts` instead (same API, just renamed)
- **`proxy.ts` must exempt `/api/admin/login`** — otherwise the login POST is blocked before reaching the route handler
- **Resend sandbox** — only delivers to the Resend account email (`rethinkingbroken@gmail.com`) until domain is verified; all other addresses silently dropped
- **Stripe test mode receipts** — Stripe does not email receipts for test charges; works in live mode only
- `NEXT_PUBLIC_SITE_URL` is the env var for the site base URL (used in resend-download route to construct download links)
- `sendDownloadEmail` expects `expiresAt: Date` — wrap Supabase timestamp string with `new Date(token.expires_at)`
- **Resend audience — use the SDK, not raw fetch** — `resend.contacts.create()` handles auth correctly; manually constructing the Authorization header with `fetch` produces intermittent `API key is invalid` errors even with a valid key
- **`metadata` exports are silently ignored on client components** — Next.js App Router emits no warning; the tags simply don't appear in `<head>`. Fix: split into a server wrapper that exports `metadata` and a client child component that handles interactivity (same pattern as thank-you page and `/shop/book`)
- **Built-in `app/sitemap.ts` + `app/robots.ts`** replace `next-sitemap` — no npm package needed; Next.js serves them automatically at `/sitemap.xml` and `/robots.txt`
- **`metadataBase` required in root layout** — without it, relative paths like `/og-image.png` in `openGraph.images` are not resolved to a full URL and OG scrapers silently skip the image