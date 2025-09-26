// /api/payfast-initiate.js
// Vercel serverless function – ESM syntax

import crypto from "crypto";

/** RFC3986 encode (spaces => %20, not '+') */
function enc(v) {
  // encodeURIComponent already does RFC3986; extra replace keeps it strict
  return encodeURIComponent(String(v)).replace(/[!'()*]/g, c =>
    `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

/** Build PayFast MD5 signature – sort keys, encode values, append passphrase if present */
function makeSignature(fields, passphrase) {
  // Exclude empty/undefined and the 'signature' itself
  const clean = {};
  for (const [k, v] of Object.entries(fields)) {
    if (k === "signature") continue;
    if (v === undefined || v === null || v === "") continue;
    clean[k] = v;
  }

  const base = Object.keys(clean)
    .sort() // alphabetical by key
    .map((k) => `${k}=${enc(clean[k])}`)
    .join("&")
    + (passphrase ? `&passphrase=${enc(passphrase)}` : "");

  const md5 = crypto.createHash("md5").update(base, "utf8").digest("hex");
  return { base, md5 };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // ---- ENV ----
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase(); // sandbox | live
    const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
    const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
    const RETURN_URL = process.env.PAYFAST_RETURN_URL;
    const CANCEL_URL = process.env.PAYFAST_CANCEL_URL;
    const NOTIFY_URL = process.env.PAYFAST_NOTIFY_URL;
    const PASSPHRASE = process.env.PAYFAST_PASSPHRASE || ""; // leave blank if none set in Sandbox

    const missing = [];
    if (!MERCHANT_ID) missing.push("PAYFAST_MERCHANT_ID");
    if (!MERCHANT_KEY) missing.push("PAYFAST_MERCHANT_KEY");
    if (!RETURN_URL) missing.push("PAYFAST_RETURN_URL");
    if (!CANCEL_URL) missing.push("PAYFAST_CANCEL_URL");
    if (!NOTIFY_URL) missing.push("PAYFAST_NOTIFY_URL");
    if (!MODE) missing.push("PAYFAST_MODE");
    if (missing.length) {
      return res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing,
      });
    }

    const engine =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // ---- INPUT FROM CLIENT ----
    const { plan = "basic", billing = "monthly", amount = 99 } = req.body || {};
    const amountStr = Number(amount).toFixed(2);

    // Keep the field set minimal while we debug signature
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      // Display
      item_name: "Ghosthome Street Access - 2 cams / 1 account - Monthly",

      // Once-off (setup) amount shown on the button:
      amount: amountStr,

      // Subscription params
      subscription_type: 1,     // 1 = subscription
      recurring_amount: amountStr,
      frequency: 3,             // 3 = monthly
      cycles: 0,                // 0 = indefinite
    };

    // ---- SIGNATURE ----
    const { base, md5 } = makeSignature(fields, PASSPHRASE);
    const signature = md5;

    // Build redirect URL (normal query encoding is fine here)
    const params = new URLSearchParams({ ...fields, signature });
    const redirect = `${engine}?${params.toString()}`;

    // Optional: verbose debug for you (remove later)
    return res.status(200).json({
      ok: true,
      mode: MODE,
      engine,
      signature_base: base,
      signature,
      fields: { ...fields, signature },
      redirect,
    });
  } catch (err) {
    console.error("payfast-initiate error", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
