// /api/payfast-initiate.js
// Vercel serverless function

import crypto from "crypto";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function md5(input) {
  return crypto.createHash("md5").update(input, "utf8").digest("hex");
}

function toCents(amount) {
  // returns a string with 2 decimals (99 -> "99.00")
  const n = Number(amount);
  if (!Number.isFinite(n)) throw new Error("Invalid amount");
  return n.toFixed(2);
}

// Build the signature from RAW (UNENCODED) values
function buildSignature(fields, passphrase) {
  // remove empty/undefined and signature itself
  const cleaned = {};
  Object.keys(fields).forEach((k) => {
    const v = fields[k];
    if (k === "signature") return;
    if (v === undefined || v === null || v === "") return;
    cleaned[k] = String(v);
  });

  // sort by key
  const sortedKeys = Object.keys(cleaned).sort();

  // join as key=value with raw values (NOT urlencoded)
  const base = sortedKeys.map((k) => `${k}=${cleaned[k]}`).join("&");

  // append passphrase last, per PayFast docs
  const full = `${base}&passphrase=${passphrase}`;

  return { base: full, signature: md5(full) };
}

// Build the redirect URL (ENCODED values)
function buildRedirectUrl(mode, fields) {
  const endpoint =
    mode === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

  const qs = Object.entries(fields)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");

  return `${endpoint}?${qs}`;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // ENV
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase(); // 'sandbox' | 'live'
    const MERCHANT_ID = required("PAYFAST_MERCHANT_ID");
    const MERCHANT_KEY = required("PAYFAST_MERCHANT_KEY");
    const PASSPHRASE = required("PAYFAST_PASSPHRASE");
    const RETURN_URL = required("PAYFAST_RETURN_URL");
    const CANCEL_URL = required("PAYFAST_CANCEL_URL");
    const NOTIFY_URL = required("PAYFAST_NOTIFY_URL");

    // Request body from /pay page
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { plan = "basic", billing = "monthly", amount = 99, recurring = true } = body;

    const amountStr = toCents(amount);

    // Human-readable label
    const item_name =
      plan === "basic"
        ? "Ghosthome Street Access - 2 cams / 1 account - Monthly"
        : plan === "plus"
        ? "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"
        : "Ghosthome Street Access - Subscription";

    const item_description =
      "Community live-view access with night notifications (customisable hours).";

    // Base fields sent to PayFast
    const payfastFields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL, // RAW for signature; will be encoded in redirect
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      amount: amountStr,
      item_name,
      item_description,

      // keep “custom_str*” light – they echo back on ITN
      custom_str2: plan,
      custom_str3: billing,
    };

    if (recurring) {
      Object.assign(payfastFields, {
        subscription_type: 1,     // 1 = recurring
        recurring_amount: amountStr,
        frequency: 3,             // 3 = monthly
        cycles: 0,                // 0 = indefinite
      });
    }

    // Signature from RAW values (no encoding)
    const { base, signature } = buildSignature(payfastFields, PASSPHRASE);

    // Final redirect URL (encoded values)
    const redirect = buildRedirectUrl(MODE, { ...payfastFields, signature });

    return res.status(200).json({
      ok: true,
      redirect,
      // uncomment for temporary debugging
      // debug: { signature_base: base, signature },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}
