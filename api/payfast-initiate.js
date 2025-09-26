// /api/payfast-initiate.js
// PayFast signature exactly per docs:
// - Sort keys alphabetically
// - URL-encode values (spaces -> '+', upper-case hex)
// - Append &passphrase=<urlencoded> if (and only if) you have set a passphrase in your PayFast Dashboard
// - MD5 of that final string
// Then POST those exact fields to the correct engine (sandbox/live) via an auto-submit form.

import crypto from "crypto";

// ---- HARD SETTINGS (keep it dead simple) ----
const USE_SUBSCRIPTIONS = true; // true = subscription billing, false = once-off

// PHP-style urlencode (spaces -> '+', upper-case hex)
const urlencode = (v) =>
  encodeURIComponent(String(v))
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

// Alphabetically sort & remove empties and signature
function normalize(fields) {
  const out = {};
  Object.keys(fields)
    .filter((k) => k !== "signature" && fields[k] !== undefined && fields[k] !== null && String(fields[k]) !== "")
    .sort()
    .forEach((k) => (out[k] = String(fields[k])));
  return out;
}

function md5(s) {
  return crypto.createHash("md5").update(s, "utf8").digest("hex");
}

function buildSignature(fields, passphrase) {
  const f = normalize(fields);
  const base =
    Object.keys(f)
      .map((k) => `${k}=${urlencode(f[k])}`)
      .join("&") + (passphrase ? `&passphrase=${urlencode(passphrase)}` : "");
  return { base, signature: md5(base) };
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const plan = (url.searchParams.get("plan") || "basic").toLowerCase();     // basic | plus
    const term = (url.searchParams.get("term") || "monthly").toLowerCase();   // monthly | yearly
    const debug = url.searchParams.get("debug") === "1";

    // ---- ENV (MUST match your PayFast Dashboard) ----
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase(); // "sandbox" or "live"
    const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID || "").trim();
    const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const PASSPHRASE = (process.env.PAYFAST_PASSPHRASE || "").trim(); // leave EMPTY here if no passphrase set in PF Dashboard
    const RETURN_URL = (process.env.PAYFAST_RETURN_URL || "").trim(); // e.g. https://ghosthome.co.za/pay?result=success
    const CANCEL_URL = (process.env.PAYFAST_CANCEL_URL || "").trim(); // e.g. https://ghosthome.co.za/pay?result=cancel
    const NOTIFY_URL = (process.env.PAYFAST_NOTIFY_URL || "").trim(); // e.g. https://ghosthome.co.za/api/payfast-itn

    const missing = [];
    if (!MERCHANT_ID) missing.push("PAYFAST_MERCHANT_ID");
    if (!MERCHANT_KEY) missing.push("PAYFAST_MERCHANT_KEY");
    if (!RETURN_URL) missing.push("PAYFAST_RETURN_URL");
    if (!CANCEL_URL) missing.push("PAYFAST_CANCEL_URL");
    if (!NOTIFY_URL) missing.push("PAYFAST_NOTIFY_URL");
    if (missing.length) {
      res.status(500).json({ ok: false, error: "Missing environment variables", missing });
      return;
    }

    // ---- Simple plans (exactly what you’re selling) ----
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

    // ---- Minimal fields only (the fewer fields, the fewer signature traps) ----
    let fields;
    if (!USE_SUBSCRIPTIONS) {
      // Once-off
      fields = {
        merchant_id: MERCHANT_ID,
        merchant_key: MERCHANT_KEY,
        return_url: RETURN_URL,
        cancel_url: CANCEL_URL,
        notify_url: NOTIFY_URL,
        amount: amt,
        item_name: itemName
      };
    } else {
      // Subscription (monthly or yearly)
      const frequency = term === "yearly" ? 7 : 3; // PayFast: 3=monthly, 7=annual (per API docs)
      fields = {
        merchant_id: MERCHANT_ID,
        merchant_key: MERCHANT_KEY,
        return_url: RETURN_URL,
        cancel_url: CANCEL_URL,
        notify_url: NOTIFY_URL,
        amount: amt,           // initial amount (charged on setup)
        item_name: itemName,
        subscription_type: 1,  // 1 = subscription
        recurring_amount: amt, // subsequent cycles
        frequency,             // 3 monthly, 7 annually
        cycles: 0              // 0 = indefinite
      };
    }

    // ---- Signature from URL-ENCODED values (doc style) ----
    const { base, signature } = buildSignature(fields, PASSPHRASE);

    if (debug) {
      res.status(200).json({
        ok: true,
        mode: MODE,
        passphrase_len: PASSPHRASE.length,
        passphrase_last2: PASSPHRASE.slice(-2),
        signature_base: base,
        signature,
        fields: { ...fields, signature }
      });
      return;
    }

    // ---- Auto-submit POST to PayFast using EXACT same fields used in signature ----
    const inputs = Object.entries({ ...fields, signature })
      .map(
        ([k, v]) =>
          `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, "&quot;")}">`
      )
      .join("\n");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).end(`<!doctype html>
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
