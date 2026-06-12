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
| `/shop/book` | `app/shop/book/page.tsx` | Client component — paperback/hardcover toggle via `useState` |
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
   c. Sends Email 1: Order Confirmation
   d. Sends Email 2: Download Link (token URL + expiry date)
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
   b. Sends Email 1: Order Confirmation to customer
   c. Sends notification email to Owl: name, address, format, qty
6. Stripe redirects to /thank-you?session_id={id}
7. Thank-you page shows order summary (no download button)
```

> **Key principle:** The webhook is the source of truth. Emails and tokens always originate from the webhook, never from the thank-you page load.

Stripe API 2026-05-27.dahlia — shipping address moved to session.collected_information.shipping_details.address

---

## Shipping

- **Physical products only** (paperback, hardcover)
- **US only** for now
- **Flat rate:** $4.99 Media Mail (3–5 business days)
- Shipping rate created in Stripe Dashboard, referenced via `STRIPE_SHIPPING_RATE_ID`
- `shipping_address_collection` + `shipping_options` both set in checkout session for physical products

---

## Email Templates

-Download Link email (digital only) — subject: Your download link is ready (#XXXXX), sent from lib/email.ts → sendDownloadEmail
-Shipping notification (physical only) — subject: New order to ship — #XXXXX (Format), sent to OWL_NOTIFICATION_EMAIL + MY_NOTIFICATION_EMAIL

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/checkout` | POST | Creates Stripe Checkout Session, returns `{ url }` |
| `/api/webhooks/stripe` | POST | Handles `checkout.session.completed` event |
| `/api/order` | GET | Returns order info by `session_id` for thank-you page |
| `/api/download` | GET | Validates token, redirects to R2 presigned URL |

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

## Admin — Link Regeneration

Password-protected page at `/admin`:

```
/admin
  └── Search by customer email
      └── Orders table: order #, date, product, token expiry, used_count
          └── [Resend Download Email] button
              → Generates new token (fresh 30-day window)
              → Sends Email 2 again
```

Protected by Next.js middleware checking `ADMIN_SECRET` env variable.

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
- [ ] `/admin` protected by middleware checking `ADMIN_SECRET`
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
RESEND_FROM_EMAIL=onboarding@resend.dev   # swap to orders@rethinkingbroken.com after domain verified
OWL_NOTIFICATION_EMAIL=owlchrysalismedicine@gmail.com
MY_NOTIFICATION_EMAIL=michaelk.ocm@gmail.com
NEXT_PUBLIC_SITE_URL=https://rethinking-broken.vercel.app  # swap to https://rethinkingbroken.com after DNS cutover

# Admin
ADMIN_SECRET=...  # strong random string
```

All of the above get added to the Vercel dashboard under Environment Variables — never to your repo.