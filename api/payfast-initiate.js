// /api/payfast-initiate.js
// Vercel serverless function – creates a PayFast redirect URL for subscriptions

import crypto from "crypto";

/** Encode exactly like PayFast expects (PHP rawurlencode: spaces => %20, not +) */
function pfEncode(v) {
  return encodeURIComponent(String(v)).replace(/%20/g, "%20");
}

/** Build query string with rawurlencode (spaces => %20) */
function toQuery(fields) {
  return Object.entries(fields)
    .map(([k, v]) => `${k}=${pfEncode(v)}`)
    .join("&");
}

/** Create PayFast signature:
 *  1) remove empty/undefined/null values
 *  2) sort by key ASC
 *  3) rawurlencode values (spaces => %20)
 *  4) append &passphrase=<encoded passphrase>
 *  5) md5 hex lower
 */
function createSignature(fields, passphrase) {
  const filtered = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

  const sorted = Object.keys(filtered)
    .sort()
    .reduce((acc, k) => ((acc[k] = filtered[k]), acc), {});

  let base = Object.entries(sorted)
    .map(([k, v]) => `${k}=${pfEncode(v)}`)
    .join("&");

  if (passphrase && String(passphrase).length > 0) {
    base += `&passphrase=${pfEncode(passphrase)}`;
  }

  return {
    base,
    signature: crypto.createHash("md5").update(base).digest("hex"),
  };
}

function required(name, value) {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const params =
      req.method === "POST" ? req.body ?? {} : Object.fromEntries(new URL(req.url, `http://${req.headers.host}`).searchParams);

    // Inputs from the client (already validated on the UI, validate again here)
    const amount = required("amount", params.amount);       // "99.00" or "129.00"
    const plan = required("plan", params.plan);             // "basic" | "plus"
    const billing = required("billing", params.billing);    // "monthly" | "annual"

    // Environment
    const MODE = process.env.PAYFAST_MODE || "sandbox";     // "sandbox" | "live"
    const MERCHANT_ID = required("PAYFAST_MERCHANT_ID", process.env.PAYFAST_MERCHANT_ID);
    const MERCHANT_KEY = required("PAYFAST_MERCHANT_KEY", process.env.PAYFAST_MERCHANT_KEY);
    const PASSPHRASE = required("PAYFAST_PASSPHRASE", process.env.PAYFAST_PASSPHRASE);

    // You can keep using your fixed URLs from env, or compute from host. We'll use env you already set.
    const RETURN_URL = required("PAYFAST_RETURN_URL", process.env.PAYFAST_RETURN_URL);
    const CANCEL_URL = required("PAYFAST_CANCEL_URL", process.env.PAYFAST_CANCEL_URL);
    const NOTIFY_URL = required("PAYFAST_NOTIFY_URL", process.env.PAYFAST_NOTIFY_URL);

    // Recurring: monthly
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      // Amount for initial payment page (PayFast still wants amount)
      amount: Number(amount).toFixed(2),

      // Display
      item_name:
        plan === "basic"
          ? "Ghosthome Street Access - 2 cams / 1 account - Monthly"
          : "Ghosthome Street Access - 4 cams / 2 accounts - Monthly",
      item_description:
        "Community live-view access with night notifications (customisable hours).",

      // Metadata for your ITN handler
      // (do not include empty strings in signature base)
      custom_str2: plan,
      custom_str3: billing,

      // Subscription options
      subscription_type: 1,                           // 1 = subscription
      recurring_amount: Number(amount).toFixed(2),    // matches amount
      frequency: 3,                                   // 3 = monthly
      cycles: 0,                                      // 0 = indefinite
    };

    const { base, signature } = createSignature(fields, PASSPHRASE);
    const pfBaseUrl =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // Build redirect with the SAME encoding as signature (rawurlencode)
    const redirectQuery = toQuery({ ...fields, signature });
    const redirect = `${pfBaseUrl}?${redirectQuery}`;

    // Optional debug for your on-page diagnostics
    if (params.diagnostics === "true") {
      return res.status(200).json({
        ok: true,
        redirect,
        debug: {
          signature_base: base,
          signature,
          mode: MODE,
          fields: { ...fields, signature },
        },
      });
    }

    // Normal response used by the /pay page
    return res.status(200).json({ ok: true, redirect });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: err?.message || "Unexpected server error" });
  }
}
