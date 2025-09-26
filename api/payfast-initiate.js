// /api/payfast-initiate.js
// ESM on Vercel. Builds a PayFast signature using PHP urlencode rules (spaces -> '+'),
// then returns a tiny HTML page that auto-POSTs the exact same fields to PayFast.

import crypto from "crypto";

// PHP-style urlencode (spaces as "+")
const pfEncode = (v) =>
  encodeURIComponent(String(v))
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

function buildSignature(fields, passphrase) {
  // 1) drop empty values & signature if present
  const cleaned = {};
  for (const [k, v] of Object.entries(fields)) {
    if (k === "signature") continue;
    if (v === undefined || v === null) continue;
    const s = String(v);
    if (s === "") continue;
    cleaned[k] = s;
  }
  // 2) sort keys A→Z and encode as key=urlencode(value)
  const pairs = Object.keys(cleaned)
    .sort()
    .map((k) => `${k}=${pfEncode(cleaned[k])}`);

  // 3) append passphrase (encoded) if present
  if (passphrase && String(passphrase).trim() !== "") {
    pairs.push(`passphrase=${pfEncode(passphrase)}`);
  }

  const base = pairs.join("&");
  const signature = crypto.createHash("md5").update(base).digest("hex");
  return { base, signature };
}

export default async function handler(req, res) {
  try {
    // read inputs from query (simple + reliable)
    const url = new URL(req.url, `http://${req.headers.host}`);
    const plan = (url.searchParams.get("plan") || "basic").toLowerCase();     // "basic" | "plus"
    const term = (url.searchParams.get("term") || "monthly").toLowerCase();   // "monthly" | "yearly"
    const debug = url.searchParams.get("debug") === "1";

    // ---- ENV (must be set in Vercel) ----
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "";
    const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "";
    const PASSPHRASE  = process.env.PAYFAST_PASSPHRASE || "";
    const RETURN_URL  = process.env.PAYFAST_RETURN_URL || "";
    const CANCEL_URL  = process.env.PAYFAST_CANCEL_URL || "";
    const NOTIFY_URL  = process.env.PAYFAST_NOTIFY_URL || "";

    const missing = [];
    if (!MERCHANT_ID) missing.push("PAYFAST_MERCHANT_ID");
    if (!MERCHANT_KEY) missing.push("PAYFAST_MERCHANT_KEY");
    if (!RETURN_URL)  missing.push("PAYFAST_RETURN_URL");
    if (!CANCEL_URL)  missing.push("PAYFAST_CANCEL_URL");
    if (!NOTIFY_URL)  missing.push("PAYFAST_NOTIFY_URL");
    if (missing.length) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: false, error: "Missing PayFast configuration", missing }));
      return;
    }

    // ---- amounts & labels (keep it simple) ----
    let amount = 99.00;
    let itemName = "Ghosthome Street Access - 2 cams / 1 account - Monthly";
    if (plan === "basic" && term === "yearly")  { amount = 1099.00; itemName = "Ghosthome Street Access - 2 cams / 1 account - 12 months"; }
    if (plan === "plus"  && term === "monthly"){ amount = 149.00;  itemName = "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"; }
    if (plan === "plus"  && term === "yearly") { amount = 1299.00; itemName = "Ghosthome Street Access - 4 cams / 2 accounts - 12 months"; }

    const itemDescription = "Community live-view access with night notifications (customisable hours).";

    // ---- endpoint ----
    const engine =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // ---- fields we will POST to PayFast (no empties) ----
    // We’ll use subscriptions for both monthly & yearly to keep your flow consistent.
    const frequency = term === "yearly" ? 7 : 3; // 7=yearly, 3=monthly (per PayFast)
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      amount: amount.toFixed(2),
      item_name: itemName,
      item_description: itemDescription,

      custom_str2: plan,        // plan tag
      custom_str3: term,        // "monthly" | "yearly"

      subscription_type: 1,           // subscription
      recurring_amount: amount.toFixed(2),
      frequency,                       // 3 or 7
      cycles: 0,                       // 0 = indefinite
    };

    // ---- signature (PHP urlencode rules) ----
    const { base, signature } = buildSignature(fields, PASSPHRASE);

    if (debug) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify({
        ok: true,
        mode: MODE,
        engine,
        signature_base: base,
        signature,
        fields: { ...fields, signature },
      }, null, 2));
      return;
    }

    // ---- return HTML auto-submit POST (bullet-proof; no browser encoding surprises) ----
    const inputs = Object.entries({ ...fields, signature })
      .filter(([, v]) => v !== undefined && v !== null && String(v) !== "")
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, "&quot;")}">`)
      .join("\n      ");

    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Redirecting to PayFast…</title></head>
<body onload="document.forms[0].submit()" style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
  <p style="padding:16px">Redirecting to PayFast…</p>
  <form method="post" action="${engine}">
      ${inputs}
      <noscript><button type="submit">Continue</button></noscript>
  </form>
</body></html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.statusCode = 200;
    res.end(html);
  } catch (e) {
    console.error("payfast-initiate error:", e);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: e?.message || "Server error" }));
  }
}
