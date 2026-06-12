import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

type ShippingAddress = {
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postal_code?: string | null
    country?: string | null
};

// Email 1 — download link (digital products only)
export const sendDownloadEmail = async ({
    to,
    customerName,
    orderNumber,
    productType,
    downloadUrl,
    expiresAt,
}: {
    to: string
    customerName: string
    orderNumber: number
    productType: string
    downloadUrl: string
    expiresAt: Date
}) => {
    const productLabel = productType === 'ebook' ? 'eBook PDF' : 'Audiobook';
    const expiry = expiresAt.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    })

    return resend.emails.send({
        from: FROM,
        to,
        subject: `Your download link is ready (#${orderNumber})`,
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h2 style="margin-bottom:8px">Your download is ready, ${customerName}!</h2>
        <p>Thank you for your purchase of <strong>Rethinking Broken — ${productLabel}</strong>.</p>
        <div style="margin:32px 0">
          <a href="${downloadUrl}"
             style="background:#1a1a1a;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-size:16px;display:inline-block">
            Download Now
          </a>
        </div>
        <p style="color:#666;font-size:14px">Order #${orderNumber} · Link expires ${expiry}</p>
        <p style="color:#666;font-size:14px">
          You can re-download any time before the expiry date.
          If your link expires, reply to this email and we'll send a new one.
        </p>
      </div>
    `,
    });
};

// Email 2 — shipping notification
export const sendShippingNotification = async ({
    customerName,
    customerEmail,
    orderNumber,
    productType,
    shippingAddress,
}: {
    customerName: string
    customerEmail: string
    orderNumber: number
    productType: string
    shippingAddress: ShippingAddress
}) => {
    const productLabel = productType === 'paperback' ? 'Paperback' : 'Hardcover';
    const addr = [
        shippingAddress.line1,
        shippingAddress.line2,
        [shippingAddress.city, shippingAddress.state, shippingAddress.postal_code]
            .filter(Boolean).join(', '),
        shippingAddress.country,
    ].filter(Boolean).join('<br>');

    return resend.emails.send({
        from: FROM,
        to: [process.env.OWL_NOTIFICATION_EMAIL!, process.env.MY_NOTIFICATION_EMAIL!],
        subject: `New order to ship — #${orderNumber} (${productLabel})`,
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h2 style="margin-bottom:24px">New order to fulfill</h2>
        <table style="border-collapse:collapse;width:100%;font-size:15px">
          <tr>
            <td style="padding:8px 16px 8px 0;color:#666;width:120px">Order #</td>
            <td><strong>#${orderNumber}</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 16px 8px 0;color:#666">Product</td>
            <td>${productLabel}</td>
          </tr>
          <tr>
            <td style="padding:8px 16px 8px 0;color:#666">Customer</td>
            <td>
              ${customerName}<br>
              <a href="mailto:${customerEmail}" style="color:#555">${customerEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 16px 8px 0;color:#666;vertical-align:top">Ship to</td>
            <td>${addr}</td>
          </tr>
        </table>
        <p style="color:#888;font-size:13px;margin-top:24px;border-top:1px solid #eee;padding-top:16px">
          Ship via Media Mail (3-5 business days).
        </p>
      </div>
    `,
    })
}