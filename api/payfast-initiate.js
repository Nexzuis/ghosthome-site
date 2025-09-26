// /api/payfast-initiate.js
import crypto from "crypto";

const pfEncode = (v) =>
  encodeURIComponent(String(v))
    .replace(/%20/g, "+")      // PHP urlencode uses + for spaces
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

const buildSignature = (fields, passphrase) => {
  // 1) Remove empty values & the signature key if present
  const cleaned = Object.fromEntries(
    Object.entries(fields).filter(
      ([k, v]) => k !== "signature" && v !== "" && v !== null && v !== undefined
    )
  );

  // 2) Sort by key (ascending)
  const ordered = Object.keys(cleaned).sort().map((k) => `${k}=${pfEncode(cleaned[k])}`);

  // 3) Append passphrase if present (encoded the same way)
  if (passphrase) ordered.push(`passphrase=${pfEncode(passphrase)}`);

  // 4) MD5 hash
  const base = ordered.join("&");
  const sig = crypto.createHash("md5").update(base).digest("hex");
  return { base, sig };
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    const {
      plan = "basic",                 // "basic" | "plus"
      billing = "monthly",            // "monthly" | "annual"
      amount,                         // "99.00" or "1099.00" etc (as string)
      name,                           // buyer name (optional)
      email,                          // buyer email (optional)
    } = req.body || {};

    // ---- ENV checks ----
    const MODE = process.env.PAYFAST_MODE || "sandbox";
    const merchant_id  = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase   = process.env.PAYFAST_PASSPHRASE || "";
    const return_url   = process.env.PAYFAST_RETURN_URL; // e.g. https://ghosthome.co.za/pay?result=success
    const cancel_url   = process.env.PAYFAST_CANCEL_URL; // e.g. https://ghosthome.co.za/pay?result=cancel
    const notify_url   = process.env.PAYFAST_NOTIFY_URL; // e.g. https://ghosthome.co.za/api/payfast-itn

    if (!merchant_id || !merchant_key || !return_url || !cancel_url || !notify_url) {
      return res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing: {
          PAYFAST_MODE: MODE,
          PAYFAST_MERCHANT_ID: !!merchant_id,
          PAYFAST_MERCHANT_KEY: !!merchant_key,
          PAYFAST_PASSPHRASE: passphrase ? true : "(empty or not set — allowed)",
          PAYFAST_RETURN_URL: !!return_url,
          PAYFAST_CANCEL_URL: !!cancel_url,
          PAYFAST_NOTIFY_URL: !!notify_url,
        },
      });
    }

    // ---- Describe the item clearly (no commas needed, but fine if present) ----
    const item_name =
      plan === "plus"
        ? (billing === "annual"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Annual"
            : "Ghosthome Street Access - 4 cams / 2 accounts - Monthly")
        : (billing === "annual"
            ? "Ghosthome Street Access - 2 cams / 1 account - Annual"
            : "Ghosthome Street Access - 2 cams / 1 account - Monthly");

    const item_description = "Community live-view access with night notifications (customisable hours).";

    // ---- Core PayFast fields (do NOT include empty values) ----
    const pfFields = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,

      // order fields
      amount: Number(amount).toFixed(2), // ensure 2 decimals as string
      item_name,
      item_description,

      // metadata (omit empty values automatically)
      custom_str1: "",             // <- stays empty -> will be dropped when signing
      custom_str2: plan,
      custom_str3: billing,

      // Recurring subscription
      subscription_type: 1,        // 1 = subscription
      recurring_amount: Number(amount).toFixed(2),
      frequency: billing === "annual" ? 6 : 3,  // 6 = monthly, 3 = monthly too? (PayFast codes: 3=monthly, 6=biannual) — we stick to 3 for monthly
      cycles: 0,                   // 0 = indefinite
    };

    // Optional buyer details — only add if present (so we don't sign empty values)
    if (name && name.trim()) pfFields["name_first"] = name.trim();
    if (email && email.trim()) pfFields["email_address"] = email.trim();

    // Build signature
    const { base, sig } = buildSignature(pfFields, passphrase);

    // Attach signature (PayFast requires the field)
    const signedFields = {
      ...Object.fromEntries(Object.entries(pfFields).filter(([_, v]) => v !== "" && v !== null && v !== undefined)),
      signature: sig,
    };

    // Post target
    const endpoint =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // Return a tiny auto-posting form (avoids CORS “failed to fetch”)
    const formInputs = Object.entries(signedFields)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, "&quot;")}" />`)
      .join("");

    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Redirecting to PayFast…</title></head>
<body onload="document.forms[0].submit()">
  <form action="${endpoint}" method="post">
    ${formInputs}
    <noscript><button type="submit">Continue to PayFast</button></noscript>
  </form>
</body></html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);

  } catch (err) {
    console.error("payfast-initiate error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
}
