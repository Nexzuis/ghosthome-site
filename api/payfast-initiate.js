// /api/payfast-initiate.js
// Vercel Node function (ESM). Generates a correct PayFast redirect URL.

import crypto from "crypto";

/** PHP urlencode (spaces as '+', keep percent-encoding) */
function urlencodePhp(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}

/** Build a PayFast-compatible query (PHP urlencode + alpha key sort) */
function buildQuery(params) {
  const pairs = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && String(v).length > 0)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${urlencodePhp(k)}=${urlencodePhp(v)}`);
  return pairs.join("&");
}

/** MD5 lowercase hex */
function md5Hex(str) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // --- env ---
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
    const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
    const PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "";
    const RETURN_URL = process.env.PAYFAST_RETURN_URL;
    const CANCEL_URL = process.env.PAYFAST_CANCEL_URL;
    const NOTIFY_URL = process.env.PAYFAST_NOTIFY_URL;

    if (!MERCHANT_ID || !MERCHANT_KEY || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL) {
      return res.status(500).json({ ok: false, error: "Missing PayFast env vars" });
    }

    // --- minimal demo item (you can plug real cart values later) ---
    // PayFast wants two decimal places for amount
    const amount = (1.00).toFixed(2);

    // Unique merchant payment id for your logs (not shown to buyer)
    const m_payment_id = `gh_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

    // Buyer email is optional; include if you have it.
    const item_name = "Ghosthome Payment";

    // --- base params (NO signature here) ---
    const baseParams = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      m_payment_id,
      amount,
      item_name
      // You can add: email_address, name_first, name_last, custom_strX, etc.
    };

    // --- signature (append passphrase at the end of the *sorted* query) ---
    const signatureBase = buildQuery(baseParams) +
      (PASSPHRASE ? `&passphrase=${urlencodePhp(PASSPHRASE)}` : "");

    const signature = md5Hex(signatureBase);

    // --- final params the buyer is redirected with (includes signature) ---
    const finalParams = { ...baseParams, signature };
    const query = buildQuery(finalParams);

    const engine =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    const redirect = `${engine}?${query}`;

    return res.status(200).json({
      ok: true,
      redirect
      // tip: if you want temporary debugging, you can also return signatureBase/signature.
    });
  } catch (e) {
    console.error("payfast-initiate error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
