// api/payfast-initiate.js
// Build PayFast fields + signature (subscription) and return them for a POST form.

import crypto from "crypto";

function urlencodePhp(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}
function md5Hex(str) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const MODE = (process.env.PAYFAST_MODE || "sandbox").trim().toLowerCase();
  const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID || "").trim();
  const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
  const PASSPHRASE = (process.env.PAYFAST_PASSPHRASE || "").trim();
  const RETURN_URL = (process.env.PAYFAST_RETURN_URL || "").trim();
  const CANCEL_URL = (process.env.PAYFAST_CANCEL_URL || "").trim();
  const NOTIFY_URL = (process.env.PAYFAST_NOTIFY_URL || "").trim();

  if (!MERCHANT_ID || !MERCHANT_KEY || !PASSPHRASE || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL) {
    res.status(400).json({ ok: false, error: "Missing PayFast configuration" });
    return;
  }

  // BASIC plan: R99.00 monthly subscription
  const amount = "99.00";

  const fields = {
    amount,                         // initial amount
    cancel_url: CANCEL_URL,
    cycles: 0,                      // 0 = indefinite
    frequency: 3,                   // 3 = monthly
    item_name: "Ghosthome Street Access - 2 cams / 1 account - Monthly",
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    notify_url: NOTIFY_URL,
    recurring_amount: amount,       // monthly amount
    return_url: RETURN_URL,
    subscription_type: 1,           // 1 = subscription
  };

  // Signature base: alpha-sort + PHP urlencode + append passphrase
  const keys = Object.keys(fields).sort();
  const base =
    keys.map((k) => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`).join("&") +
    `&passphrase=${urlencodePhp(PASSPHRASE)}`;

  const signature = md5Hex(base);

  const engine =
    MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

  // Return raw fields (no encoding), the browser will submit a real form POST.
  res.status(200).json({
    ok: true,
    engine,
    fields: { ...fields, signature },
  });
}
