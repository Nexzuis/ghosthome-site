// Minimal, bullet-proof PayFast initiator.
// - ?minimal=1 => once-off payment with only required fields
// - default => subscription (monthly/yearly)
// - ?debug=1 => return JSON diagnostics instead of HTML auto-POST

import crypto from "crypto";

const enc = (v) =>
  encodeURIComponent(String(v))
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

function sign(fields, passphraseRaw) {
  const passphrase = String(passphraseRaw || "").trim();
  const cleaned = {};
  for (const [k, v] of Object.entries(fields)) {
    if (k === "signature") continue;
    if (v === undefined || v === null) continue;
    const s = String(v);
    if (s === "") continue;
    cleaned[k] = s;
  }
  const base =
    Object.keys(cleaned)
      .sort()
      .map((k) => `${k}=${enc(cleaned[k])}`)
      .join("&") +
    (passphrase ? `&passphrase=${enc(passphrase)}` : "");
  const signature = crypto.createHash("md5").update(base).digest("hex");
  return { base, signature, passphrase };
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const plan = (url.searchParams.get("plan") || "basic").toLowerCase();   // basic|plus
    const term = (url.searchParams.get("term") || "monthly").toLowerCase(); // monthly|yearly
    const minimal = url.searchParams.get("minimal") === "1";
    const debug = url.searchParams.get("debug") === "1";

    const {
      PAYFAST_MODE = "sandbox",
      PAYFAST_MERCHANT_ID,
      PAYFAST_MERCHANT_KEY,
      PAYFAST_PASSPHRASE = "",
      PAYFAST_RETURN_URL,
      PAYFAST_CANCEL_URL,
      PAYFAST_NOTIFY_URL,
    } = process.env;

    const missing = [];
    if (!PAYFAST_MERCHANT_ID) missing.push("PAYFAST_MERCHANT_ID");
    if (!PAYFAST_MERCHANT_KEY) missing.push("PAYFAST_MERCHANT_KEY");
    if (!PAYFAST_RETURN_URL) missing.push("PAYFAST_RETURN_URL");
    if (!PAYFAST_CANCEL_URL) missing.push("PAYFAST_CANCEL_URL");
    if (!PAYFAST_NOTIFY_URL) missing.push("PAYFAST_NOTIFY_URL");
    if (missing.length) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: false, error: "Missing env", missing }));
      return;
    }

    const engine =
      (PAYFAST_MODE || "sandbox").toLowerCase() === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // Prices & labels
    let amount = 99.0;
    let itemName = "Ghosthome Street Access - 2 cams / 1 account - Monthly";
    if (plan === "basic" && term === "yearly")  { amount = 1099.0; itemName = "Ghosthome Street Access - 2 cams / 1 account - 12 months"; }
    if (plan === "plus"  && term === "monthly") { amount = 149.0;  itemName = "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"; }
    if (plan === "plus"  && term === "yearly")  { amount = 1299.0; itemName = "Ghosthome Street Access - 4 cams / 2 accounts - 12 months"; }
    const amt = amount.toFixed(2);

    let fields;
    if (minimal) {
      // 🔹 Minimal once-off: ONLY required fields
      fields = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: PAYFAST_RETURN_URL,
        cancel_url: PAYFAST_CANCEL_URL,
        notify_url: PAYFAST_NOTIFY_URL,
        amount: amt,
        item_name: itemName,
      };
    } else {
      // 🔸 Subscription (monthly/yearly)
      const frequency = term === "yearly" ? 7 : 3; // PayFast: 7=yearly, 3=monthly
      fields = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: PAYFAST_RETURN_URL,
        cancel_url: PAYFAST_CANCEL_URL,
        notify_url: PAYFAST_NOTIFY_URL,
        amount: amt,
        item_name: itemName,
        // keep payload tiny to avoid any encoding surprises
        subscription_type: 1,
        recurring_amount: amt,
        frequency,
        cycles: 0,
      };
    }

    const { base, signature, passphrase } = sign(fields, PAYFAST_PASSPHRASE);

    if (debug) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify({
        ok: true,
        mode: PAYFAST_MODE,
        passphrase_len: passphrase.length,
        passphrase_last2: passphrase.slice(-2),
        signature_base: base,
        signature,
        fields: { ...fields, signature },
      }, null, 2));
      return;
    }

    // Auto-submit POST page to PayFast
    const inputs = Object.entries({ ...fields, signature })
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, "&quot;")}">`)
      .join("\n");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.statusCode = 200;
    res.end(`<!doctype html>
<html><head><meta charset="utf-8"><title>Redirecting…</title></head>
<body onload="document.forms[0].submit()" style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
  <p style="padding:16px">Redirecting to PayFast…</p>
  <form action="${engine}" method="post">
${inputs}
    <noscript><button type="submit">Continue</button></noscript>
  </form>
</body></html>`);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: e?.message || "Server error" }));
  }
}
