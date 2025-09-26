// /api/payfast-initiate.js
// Builds a PayFast signature and auto-POSTs a form to PayFast.
// This version signs using URL-ENCODED values (PayFast doc style) and sends a lean field set.

import crypto from "crypto";

// --- CONFIG TOGGLE: change these if needed ---
const USE_SUBSCRIPTIONS = true;     // true => subscription; false => once-off minimal
const SIGN_STYLE = "enc";           // "enc" (urlencoded, recommended by PF docs) or "raw"

// PHP-style urlencode (spaces -> '+') for encoded style
const enc = (v) =>
  encodeURIComponent(String(v))
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

function sortClean(fields) {
  const out = {};
  Object.keys(fields)
    .filter(
      (k) =>
        k !== "signature" &&
        fields[k] !== undefined &&
        fields[k] !== null &&
        String(fields[k]) !== ""
    )
    .sort()
    .forEach((k) => (out[k] = String(fields[k])));
  return out;
}

function md5(s) {
  return crypto.createHash("md5").update(s, "utf8").digest("hex");
}

// Build signature from URLENCODED values (PayFast doc style)
function sigEncoded(fields, passphrase) {
  const f = sortClean(fields);
  const base =
    Object.keys(f)
      .map((k) => `${k}=${enc(f[k])}`)
      .join("&") +
    (passphrase ? `&passphrase=${enc(passphrase)}` : "");
  return { base, signature: md5(base) };
}

// Build signature from RAW (UNENCODED) values
function sigRaw(fields, passphrase) {
  const f = sortClean(fields);
  const base =
    Object.keys(f)
      .map((k) => `${k}=${f[k]}`)
      .join("&") +
    (passphrase ? `&passphrase=${passphrase}` : "");
  return { base, signature: md5(base) };
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Inputs (keep simple)
    const plan = (url.searchParams.get("plan") || "basic").toLowerCase();   // basic|plus
    const term = (url.searchParams.get("term") || "monthly").toLowerCase(); // monthly|yearly
    const debug = url.searchParams.get("debug") === "1";

    // --- ENV (must be set in Vercel, Production scope for your live domain) ---
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID || "").trim();
    const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const PASSPHRASE = (process.env.PAYFAST_PASSPHRASE || "").trim(); // may be empty if not set in PF
    const RETURN_URL = (process.env.PAYFAST_RETURN_URL || "").trim();
    const CANCEL_URL = (process.env.PAYFAST_CANCEL_URL || "").trim();
    const NOTIFY_URL = (process.env.PAYFAST_NOTIFY_URL || "").trim();

    const missing = [];
    if (!MERCHANT_ID) missing.push("PAYFAST_MERCHANT_ID");
    if (!MERCHANT_KEY) missing.push("PAYFAST_MERCHANT_KEY");
    if (!RETURN_URL) missing.push("PAYFAST_RETURN_URL");
    if (!CANCEL_URL) missing.push("PAYFAST_CANCEL_URL");
    if (!NOTIFY_URL) missing.push("PAYFAST_NOTIFY_URL");
    if (missing.length) {
      res.status(500).json({ ok: false, error: "Missing env", missing });
      return;
    }

    // --- Prices & names ---
    let amount = 99.0;
    let itemName = "Ghosthome Street Access - 2 cams / 1 account - Monthly";
    if (plan === "basic" && term === "yearly") {
      amount = 1099.0;
      itemName = "Ghosthome Street Access - 2 cams / 1 account - 12 months";
    }
    if (plan === "plus" && term === "monthly") {
      amount = 149.0;
      itemName = "Ghosthome Street Access - 4 cams / 2 accounts - Monthly";
    }
    if (plan === "plus" && term === "yearly") {
      amount = 1299.0;
      itemName = "Ghosthome Street Access - 4 cams / 2 accounts - 12 months";
    }
    const amt = amount.toFixed(2);

    const engine =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // --- Lean field set (only what’s needed) ---
    let fields;
    if (!USE_SUBSCRIPTIONS) {
      // Once-off minimal
      fields = {
        merchant_id: MERCHANT_ID,
        merchant_key: MERCHANT_KEY,
        return_url: RETURN_URL,
        cancel_url: CANCEL_URL,
        notify_url: NOTIFY_URL,
        amount: amt,
        item_name: itemName,
      };
    } else {
      // Subscription – minimal
      const frequency = term === "yearly" ? 7 : 3; // PF: 7=yearly, 3=monthly
      fields = {
        merchant_id: MERCHANT_ID,
        merchant_key: MERCHANT_KEY,
        return_url: RETURN_URL,
        cancel_url: CANCEL_URL,
        notify_url: NOTIFY_URL,
        amount: amt,
        item_name: itemName,
        subscription_type: 1,
        recurring_amount: amt,
        frequency,
        cycles: 0,
      };
    }

    // Compute both styles; send ENC (per SIGN_STYLE)
    const pass = PASSPHRASE; // may be empty if PF account has no passphrase
    const encoded = sigEncoded(fields, pass);
    const raw = sigRaw(fields, pass);
    const chosen = SIGN_STYLE === "raw" ? raw : encoded;

    if (debug) {
      res.status(200).json({
        ok: true,
        mode: MODE,
        use_subscriptions: USE_SUBSCRIPTIONS,
        style: SIGN_STYLE,
        passphrase_len: pass.length,
        passphrase_last2: pass.slice(-2),
        encoded_base: encoded.base,
        encoded_sig: encoded.signature,
        raw_base: raw.base,
        raw_sig: raw.signature,
        sending_signature: chosen.signature,
        sending_fields: { ...fields, signature: chosen.signature },
      });
      return;
    }

    // Auto-submit POST to PayFast
    const inputs = Object.entries({ ...fields, signature: chosen.signature })
      .map(
        ([k, v]) =>
          `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, "&quot;")}">`
      )
      .join("\n");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res
      .status(200)
      .end(`<!doctype html>
<html><head><meta charset="utf-8"><title>Redirecting…</title></head>
<body onload="document.forms[0].submit()" style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
  <p style="padding:16px">Redirecting to PayFast…</p>
  <form action="${engine}" method="post">
${inputs}
    <noscript><button type="submit">Continue</button></noscript>
  </form>
</body></html>`);
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}
