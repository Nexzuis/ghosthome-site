// /api/payfast-initiate.js
import crypto from "crypto";

// PHP-style urlencode (spaces -> '+')
const enc = (v) =>
  encodeURIComponent(String(v))
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

function sortClean(fields) {
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

// Build signature from URLENCODED values (PayFast doc style)
function sigEncoded(fields, passphrase) {
  const f = sortClean(fields);
  const base =
    Object.keys(f).map((k) => `${k}=${enc(f[k])}`).join("&") +
    (passphrase ? `&passphrase=${enc(String(passphrase).trim())}` : "");
  return { base, signature: md5(base) };
}

// Build signature from RAW (UNENCODED) values (some gateways expect this)
function sigRaw(fields, passphrase) {
  const f = sortClean(fields);
  const base =
    Object.keys(f).map((k) => `${k}=${f[k]}`).join("&") +
    (passphrase ? `&passphrase=${String(passphrase).trim()}` : "");
  return { base, signature: md5(base) };
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const plan   = (url.searchParams.get("plan") || "basic").toLowerCase();     // basic|plus
    const term   = (url.searchParams.get("term") || "monthly").toLowerCase();   // monthly|yearly
    const style  = (url.searchParams.get("style") || "enc").toLowerCase();      // enc|raw
    const lean   = url.searchParams.get("lean") === "1";                         // minimal payload
    const debug  = url.searchParams.get("debug") === "1";

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
      return res.status(500).json({ ok: false, error: "Missing env", missing });
    }

    const engine = (PAYFAST_MODE.toLowerCase() === "live")
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

    // amounts + label
    let amount = 99.0;
    let itemName = "Ghosthome Street Access - 2 cams / 1 account - Monthly";
    if (plan === "basic" && term === "yearly")  { amount = 1099.0; itemName = "Ghosthome Street Access - 2 cams / 1 account - 12 months"; }
    if (plan === "plus"  && term === "monthly") { amount = 149.0;  itemName = "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"; }
    if (plan === "plus"  && term === "yearly")  { amount = 1299.0; itemName = "Ghosthome Street Access - 4 cams / 2 accounts - 12 months"; }
    const amt = amount.toFixed(2);

    // Build fields (subscription default). Lean mode strips optional fields.
    const frequency = term === "yearly" ? 7 : 3; // 7 yearly, 3 monthly (per PF)
    const baseFields = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: PAYFAST_RETURN_URL,
      cancel_url: PAYFAST_CANCEL_URL,
      notify_url: PAYFAST_NOTIFY_URL,
      amount: amt,
      item_name: itemName,
      subscription_type: 1,
      recurring_amount: amt,
      frequency,
      cycles: 0,
    };

    const fullFields = lean
      ? baseFields
      : {
          ...baseFields,
          // keep extras small to avoid encoding edge-cases
          // (comment back in later once sig is accepted)
          // item_description:
          //   "Community live-view access with night notifications (customisable hours).",
          // custom_str2: plan,
          // custom_str3: term,
        };

    // Compute both styles so we can compare
    const pass = (PAYFAST_PASSPHRASE || "").trim();
    const encoded = sigEncoded(fullFields, pass);
    const raw = sigRaw(fullFields, pass);

    // Which one to send?
    const chosen = style === "raw" ? raw : encoded;
    const fieldsWithSig = { ...fullFields, signature: chosen.signature };

    if (debug) {
      return res.status(200).json({
        ok: true,
        mode: PAYFAST_MODE,
        style,
        lean: !!lean,
        passphrase_len: pass.length,
        passphrase_last2: pass.slice(-2),
        encoded_base: encoded.base,
        encoded_sig: encoded.signature,
        raw_base: raw.base,
        raw_sig: raw.signature,
        sending_signature: chosen.signature,
        sending_fields: fieldsWithSig,
      });
    }

    // Auto-submit POST to PayFast
    const inputs = Object.entries(fieldsWithSig)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, "&quot;")}">`)
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
