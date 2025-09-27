// /api/payfast-diagnose.js  (TEMPORARY DEBUG)
// Shows the exact signature base string + redirect URL we generate.

import crypto from "crypto";

function urlencodePhp(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}
function md5Hex(str) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

export default async function handler(req, res) {
  // Build the SAME fields you use for your subscription
  const MODE = (process.env.PAYFAST_MODE || "sandbox").trim().toLowerCase();
  const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID || "").trim();
  const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
  const PASSPHRASE = (process.env.PAYFAST_PASSPHRASE || "").trim();
  const RETURN_URL = (process.env.PAYFAST_RETURN_URL || "").trim();
  const CANCEL_URL = (process.env.PAYFAST_CANCEL_URL || "").trim();
  const NOTIFY_URL = (process.env.PAYFAST_NOTIFY_URL || "").trim();

  const amount = "99.00"; // monthly price

  const fields = {
    amount,
    cancel_url: CANCEL_URL,
    cycles: 0,
    frequency: 3, // monthly
    item_name: "Ghosthome Street Access - 2 cams / 1 account - Monthly",
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    notify_url: NOTIFY_URL,
    recurring_amount: amount,
    return_url: RETURN_URL,
    subscription_type: 1,
  };

  const keys = Object.keys(fields).sort();
  const base =
    keys.map((k) => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`).join("&") +
    (PASSPHRASE ? `&passphrase=${urlencodePhp(PASSPHRASE)}` : "");

  const signature = md5Hex(base);

  const send = { ...fields, signature };
  const query = Object.keys(send)
    .sort()
    .map((k) => `${k}=${urlencodePhp(send[k])}`)
    .join("&");

  const engine =
    MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

  const redirect = `${engine}?${query}`;

  // DO NOT print your passphrase—only lengths and last 2 chars to verify trim/whitespace issues
  res.status(200).json({
    ok: true,
    checks: {
      PAYFAST_MODE: MODE,
      PAYFAST_MERCHANT_ID: MERCHANT_ID,
      PAYFAST_MERCHANT_KEY: MERCHANT_KEY,
      PAYFAST_PASSPHRASE_len: PASSPHRASE.length,
      PAYFAST_PASSPHRASE_tail: PASSPHRASE.slice(-2),
      RETURN_URL,
      CANCEL_URL,
      NOTIFY_URL,
    },
    signature_base: base,
    signature_md5: signature,
    preview_redirect: redirect,
  });
}
