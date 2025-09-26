// Node.js (Vercel Serverless Function)
// Full file — paste as-is.

import crypto from "crypto";

/** PHP urlencode equivalent (space -> '+', plus -> %2B, etc.) */
function phpUrlEncode(str = "") {
  return encodeURIComponent(String(str))
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/'/g, "%27")
    .replace(/%20/g, "+");
}

/** Build MD5 signature exactly like PayFast PHP sample */
function buildSignature(fields, passphrase) {
  // 1) Remove empty values & the signature itself
  const filtered = Object.entries(fields)
    .filter(([k, v]) => k !== "signature" && v !== undefined && v !== null && String(v) !== "");

  // 2) Sort alphabetically by parameter name
  filtered.sort(([a], [b]) => a.localeCompare(b));

  // 3) Build the "key=urlencoded(value)" pairs with '&'
  const base = filtered.map(([k, v]) => `${k}=${phpUrlEncode(String(v))}`).join("&");

  // 4) Append passphrase if present
  const baseWithPass = passphrase ? `${base}&passphrase=${phpUrlEncode(passphrase)}` : base;

  // 5) MD5 lowercase
  const signature = crypto.createHash("md5").update(baseWithPass, "utf8").digest("hex");
  return { base, baseWithPass, signature };
}

/** Minimal, boring, by-the-docs field set for a subscription */
function buildFields() {
  const {
    PAYFAST_MODE = "sandbox",
    PAYFAST_MERCHANT_ID,
    PAYFAST_MERCHANT_KEY,
    PAYFAST_RETURN_URL,
    PAYFAST_CANCEL_URL,
    PAYFAST_NOTIFY_URL,
    PAYFAST_PASSPHRASE,
  } = process.env;

  if (!PAYFAST_MERCHANT_ID || !PAYFAST_MERCHANT_KEY || !PAYFAST_RETURN_URL ||
      !PAYFAST_CANCEL_URL || !PAYFAST_NOTIFY_URL) {
    return { error: "Missing PayFast env vars." };
  }

  // Keep it dead simple: BASIC plan @ R99 monthly.
  const fields = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: PAYFAST_RETURN_URL,
    cancel_url: PAYFAST_CANCEL_URL,
    notify_url: PAYFAST_NOTIFY_URL,

    amount: "99.00",
    item_name: "Ghosthome Street Access - 2 cams / 1 account - Monthly",

    // Recurring billing
    subscription_type: 1,     // 1 = subscription
    recurring_amount: "99.00",
    frequency: 3,             // 3 = monthly
    cycles: 0,                // 0 = indefinite
  };

  // Choose engine by mode
  const engine =
    PAYFAST_MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

  const sig = buildSignature(fields, PAYFAST_PASSPHRASE);

  // Add signature to the *sent* fields
  const sending = { ...fields, signature: sig.signature };

  return { mode: PAYFAST_MODE, engine, fields, sending, sig };
}

/** Vercel API handler */
export default async function handler(req, res) {
  // Allow GET for diagnostics, POST for normal flow
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const built = buildFields();
  if (built.error) {
    res.status(500).json({ ok: false, error: built.error });
    return;
  }

  const { mode, engine, sending, sig } = built;

  // If you hit this endpoint as GET with ?diagnostics=1 we show the full bases/signature
  const wantDiag =
    req.method === "GET" &&
    (req.query.diagnostics === "1" || req.query.diag === "1" || req.query.debug === "1");

  if (wantDiag) {
    res.status(200).json({
      ok: true,
      mode,
      engine,
      // What we sign on (alphabetically sorted, URL-encoded values)
      signature_base: sig.base,
      signature_base_with_passphrase: sig.baseWithPass,
      signature: sig.signature,
      // What we actually send to PayFast (includes signature, *no* passphrase)
      sending_fields: sending,
    });
    return;
  }

  // Build redirect URL to the PayFast engine
  // IMPORTANT: preserve our own encoding — do not let URLSearchParams change ordering/encoding.
  const query = Object.entries(sending)
    .map(([k, v]) => `${k}=${phpUrlEncode(String(v))}`)
    .join("&");

  const redirectUrl = `${engine}?${query}`;

  // For frontend fetch, return JSON with URL (the page then window.location = url)
  res.status(200).json({ ok: true, redirect: redirectUrl });
}
