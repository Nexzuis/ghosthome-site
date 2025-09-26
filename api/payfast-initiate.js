// /api/payfast-initiate.js
// Vercel Node Function

export default async function handler(req, res) {
  try {
    // Accept both GET and POST
    const isPost = req.method === 'POST';
    const input = isPost ? req.body || {} : req.query || {};

    // ---- Your plans / amounts (keep simple for now) ----
    // plan: 'basic' or 'plus' ; billing: 'monthly' or 'annual'
    const plan = String(input.plan || 'basic');
    const billing = String(input.billing || 'monthly');

    // Map to R values
    let amount = 99.0;          // default BASIC monthly
    let itemName = 'Ghosthome Street Access - 2 cams / 1 account - Monthly';
    if (plan === 'basic' && billing === 'annual') {
      amount = 1099.0;
      itemName = 'Ghosthome Street Access - 2 cams / 1 account - 12 months';
    }
    if (plan === 'plus' && billing === 'monthly') {
      amount = 149.0;
      itemName = 'Ghosthome Street Access - 4 cams / 2 accounts - Monthly';
    }
    if (plan === 'plus' && billing === 'annual') {
      amount = 1299.0;
      itemName = 'Ghosthome Street Access - 4 cams / 2 accounts - 12 months';
    }
    const amountStr = Number(amount).toFixed(2);

    // ---- Required ENV ----
    const {
      PAYFAST_MODE = 'sandbox',
      PAYFAST_MERCHANT_ID,
      PAYFAST_MERCHANT_KEY,
      PAYFAST_PASSPHRASE,
      PAYFAST_RETURN_URL,
      PAYFAST_CANCEL_URL,
      PAYFAST_NOTIFY_URL,
    } = process.env;

    const missing = [];
    if (!PAYFAST_MERCHANT_ID) missing.push('PAYFAST_MERCHANT_ID');
    if (!PAYFAST_MERCHANT_KEY) missing.push('PAYFAST_MERCHANT_KEY');
    if (!PAYFAST_PASSPHRASE) missing.push('PAYFAST_PASSPHRASE');
    if (!PAYFAST_RETURN_URL) missing.push('PAYFAST_RETURN_URL');
    if (!PAYFAST_CANCEL_URL) missing.push('PAYFAST_CANCEL_URL');
    if (!PAYFAST_NOTIFY_URL) missing.push('PAYFAST_NOTIFY_URL');

    if (missing.length) {
      return res
        .status(500)
        .json({ ok: false, error: 'Missing PayFast configuration', missing });
    }

    const host =
      (PAYFAST_MODE || '').toLowerCase() === 'live'
        ? 'www.payfast.co.za'
        : 'sandbox.payfast.co.za';

    // ---- Build fields ----
    const fields = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: PAYFAST_RETURN_URL,
      cancel_url: PAYFAST_CANCEL_URL,
      notify_url: PAYFAST_NOTIFY_URL,

      amount: amountStr,
      item_name: itemName,
      item_description:
        'Community live-view access with night notifications (customisable hours).',

      // Custom tags to recognise the order in ITN
      custom_str2: plan,             // 'basic' or 'plus'
      custom_str3: billing,          // 'monthly' or 'annual'

      // Recurring billing
      subscription_type: 1,          // 1 = subscription
      recurring_amount: amountStr,   // same as amount
      frequency: 3,                  // 3 = monthly
      cycles: 0,                     // 0 = indefinite until cancel
    };

    // ---- Signature builder (PayFast spec) ----
    // 1) Sort keys A->Z
    // 2) Keep only non-empty values
    // 3) Encode each value like application/x-www-form-urlencoded (space => '+')
    // 4) Append "&passphrase=..." (encoded) at the end
    const encode = (v) =>
      encodeURIComponent(String(v))
        .replace(/%20/g, '+')                      // spaces as '+'
        .replace(/[!'()*]/g, (c) =>
          '%' + c.charCodeAt(0).toString(16).toUpperCase()
        );

    const keys = Object.keys(fields)
      .filter((k) => fields[k] !== undefined && fields[k] !== null && fields[k] !== '')
      .sort();

    const signatureBase =
      keys.map((k) => `${k}=${encode(fields[k])}`).join('&') +
      `&passphrase=${encode(PAYFAST_PASSPHRASE)}`;

    const crypto = await import('crypto');
    const signature = crypto.createHash('md5').update(signatureBase).digest('hex');

    // ---- Redirect URL (GET) ----
    const qs = new URLSearchParams({
      ...fields,
      signature,
    }).toString();

    const redirect = `https://${host}/eng/process?${qs}`;

    const payload = { ok: true, redirect };
    // Helpful debug in non-prod:
    if (process.env.NODE_ENV !== 'production') {
      payload.debug = {
        mode: PAYFAST_MODE,
        signature_base: signatureBase,
        signature,
        fields: { ...fields, signature },
      };
    }

    return res.status(200).json(payload);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Server error',
    });
  }
}
