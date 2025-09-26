// api/payfast-initiate.js
// Node (Edge disabled) – uses Node's crypto for MD5
import crypto from "crypto";

function urlencodePhp(value) {
  // Emulate PHP's urlencode:
  // encodeURIComponent then convert spaces to '+' and keep others percent-encoded
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

  // ----- ENV -----
  const MODE = (process.env.PAYFAST_MODE || "sandbox").trim().toLowerCase();
  const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID || "").trim();
  const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
  const PASSPHRASE = (process.env.PAYFAST_PASSPHRASE || "").trim();
  const RETURN_URL = (process.env.PAYFAST_RETURN_URL || "").trim();
  const CANCEL_URL = (process.env.PAYFAST_CANCEL_URL || "").trim();
  const NOTIFY_URL = (process.env.PAYFAST_NOTIFY_URL || "").trim();

  // quick sanity
  if (!MERCHANT_ID || !MERCHANT_KEY || !PASSPHRASE || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL) {
    res.status(400).json({
      ok: false,
      error: "Missing PayFast configuration",
      missing: {
        PAYFAST_MODE: MODE || "(empty)",
        PAYFAST_MERCHANT_ID: !!MERCHANT_ID,
        PAYFAST_MERCHANT_KEY: !!MERCHANT_KEY,
        PAYFAST_PASSPHRASE: !!PASSPHRASE,
        PAYFAST_RETURN_URL: !!RETURN_URL,
        PAYFAST_CANCEL_URL: !!CANCEL_URL,
        PAYFAST_NOTIFY_URL: !!NOTIFY_URL,
      },
    });
    return;
  }

  // ----- BASIC PLAN (R99 monthly) -----
  const amount = "99.00";

  // Minimal fields (subscription)
  const fields = {
    amount,                            // "99.00"
    cancel_url: CANCEL_URL,
    cycles: 0,                         // 0 = indefinite
    frequency: 3,                      // 3 = monthly (per PayFast docs)
    item_name: "Ghosthome Street Access - 2 cams / 1 account - Monthly",
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    notify_url: NOTIFY_URL,
    recurring_amount: amount,
    return_url: RETURN_URL,
    subscription_type: 1,              // 1 = subscription
    // NOTE: intentionally no item_description or custom_* to keep the signature surface tiny
  };

  // ----- STRING TO SIGN (PayFast style) -----
  // 1) sort keys alphabetically
  const sorted = Object.keys(fields).sort();

  // 2) build k=v joined by &, skipping empty values
  const base = sorted
    .filter((k) => fields[k] !== undefined && fields[k] !== null && `${fields[k]}` !== "")
    .map((k) => `${k}=${urlencodePhp(fields[k])}`)
    .join("&");

  // 3) append passphrase (urlencoded the same way)
  const signatureBase = `${base}&passphrase=${urlencodePhp(PASSPHRASE)}`;

  // 4) md5 lowercase hex
  const signature = md5Hex(signatureBase);

  // add signature to the fields we send to PayFast
  const sendFields = { ...fields, signature };

  // build final redirect URL
  const engine =
    MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

  const query = Object.keys(sendFields)
    .sort()
    .map((k) => `${k}=${urlencodePhp(sendFields[k])}`)
    .join("&");

  const redirect = `${engine}?${query}`;

  // For the button, just return the URL to hit with window.location
  res.status(200).json({
    ok: true,
    redirect,
    // leave a tiny bit of debug to verify once (optional)
    debug: {
      mode: MODE,
      signatureBase,
      signature,
    },
  });
}
