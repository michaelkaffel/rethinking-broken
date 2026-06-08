# RethinkingBroken.com — Technical Reference

---

## ⚠️ Why the 827 MB Audiobook Dictates the Download Architecture

Vercel serverless functions have a **4.5 MB response size limit** and **10-second execution timeout** on the free tier. Proxying an 827 MB file through Vercel will fail every time.

**Solution: Cloudflare R2 Presigned URLs**

The download link redirects **directly to Cloudflare R2**, bypassing Vercel entirely. Vercel only generates the signed URL (a tiny API call) — it never touches the file bytes.

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

## Purchase Flows

### Digital Products (eBook / Audiobook)

```
1. Customer checks out → Stripe hosted checkout page
2. Stripe payment succeeds
3. Stripe fires webhook → /api/webhooks/stripe
4. Webhook handler:
   a. Creates order record in Supabase
   b. Generates download token (UUID) with 30-day expiry
   c. Sends Email 1: Order Confirmation (order #, items, price, customer info)
   d. Sends Email 2: Download Link (token URL, expiry date, download button)
5. Stripe redirects customer to /thank-you?session_id={id}
6. Thank-you page calls /api/order?session_id={id}
   → Returns order info + download URL
   → Shows order summary + Download button
```

### Physical Books (Paperback / Hardcover)

```
1. Customer checks out → Stripe hosted checkout page
2. Stripe payment succeeds
3. Stripe fires webhook → /api/webhooks/stripe
4. Webhook handler:
   a. Creates order record in Supabase
   b. Sends Email 1: Order Confirmation to customer
   c. Sends notification email to owner: name, address, book type, qty
5. Stripe redirects to /thank-you?session_id={id}
6. Thank-you page shows order summary (no download button)
```

> **Key principle:** The webhook is the source of truth — not the redirect. Emails and tokens always originate from the webhook, never from the thank-you page load.

---

## Email Templates

### Email 1 — Order Confirmation (all products)
- **Subject:** `Your order is confirmed (#XXXXX)`
- **Content:** Order #, date, items, pricing breakdown, customer info
- **From:** `orders@rethinkingbroken.com` via Resend

### Email 2 — Download Link (digital products only)
- **Subject:** `Your download link is ready (#XXXXX)`
- **Content:** Order #, product image, Download button, expiry date
- **Body note:** *"Links are valid for 30 days"*
- **From:** `orders@rethinkingbroken.com` via Resend

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/checkout` | POST | Creates Stripe Checkout Session, returns URL |
| `/api/webhooks/stripe` | POST | Handles `checkout.session.completed` event |
| `/api/order` | GET | Returns order info by `session_id` for thank-you page |
| `/api/download` | GET | Validates token, redirects to R2 presigned URL |

### The one Stripe event you care about
```javascript
// In /api/webhooks/stripe
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
3. Generate a **short-lived R2 presigned URL** (15 min — the token is the long-lived credential)
4. Increment `used_count` (audit only — re-downloads within 30 days are allowed)
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
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz DEFAULT now(),
  stripe_session_id   text UNIQUE,
  order_number        integer GENERATED ALWAYS AS IDENTITY
                      (START WITH 11000),
  customer_email      text,
  customer_name       text,
  customer_phone      text,
  product_type        text,  -- 'paperback'|'hardcover'|'ebook'|'audiobook'
  amount_total        integer,  -- in cents
  shipping_address    jsonb  -- physical orders only
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

- [ ] `STRIPE_SECRET_KEY` only in server-side API routes — never in client components or `NEXT_PUBLIC_` vars
- [ ] Webhook handler verifies Stripe signature with `stripe.webhooks.constructEvent()`
- [ ] R2 bucket is **fully private** — zero public access configured
- [ ] All download links are server-generated presigned URLs — never a static R2 path
- [ ] Download tokens are UUIDs — not derived from any order data
- [ ] Presigned URLs are short-lived (15 min) even though tokens are valid 30 days
- [ ] `/admin` protected by middleware checking `ADMIN_SECRET`
- [ ] All secrets in Vercel environment variables — never in Git
- [ ] `.env.local` in `.gitignore` from day one
- [ ] HTTPS automatic on Vercel

---

## Environment Variables

```bash
# .env.local — never commit this file

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Price IDs
STRIPE_PRICE_PAPERBACK=price_...
STRIPE_PRICE_HARDCOVER=price_...
STRIPE_PRICE_EBOOK=price_...
STRIPE_PRICE_AUDIOBOOK=price_...

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # server-side only, never NEXT_PUBLIC_

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=rethinking-broken-files
R2_EBOOK_KEY=rethinking-broken-ebook.pdf
R2_AUDIOBOOK_KEY=rethinking-broken-audiobook.zip

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=orders@rethinkingbroken.com
OWNER_NOTIFICATION_EMAIL=your@email.com

# Admin
ADMIN_SECRET=...  # strong random string
```

All of the above get added to the Vercel dashboard under Environment Variables — never to your repo.
