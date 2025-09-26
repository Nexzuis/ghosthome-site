// api/payfast-initiate.js
// Minimal PayFast redirect builder with a correct MD5 signature.
// Works in Vercel serverless (Node runtime). Accepts POST or GET.

import crypto from "crypto";

export default async function handler(req, res) {
  try {
    // 1) Read env
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase(); // "sandbox" | "live"
    const PASS = process.env.PAYFAST_PASSPHRASE || "";                  // e.g. 1234567891011
    const MERCHANT_ID  = process.env.PAYFAST_MERCHANT_ID;
    const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;

    const RETURN_URL = process.env.PAYFAST_RETURN_URL || "https://ghosthome.co.za/pay?result=success";
    const CANCEL_URL = process.env.PAYFAST_CANCEL_URL || "https://ghosthome.co.za/pay?result=cancel";
    const NOTIFY_URL = process.env.PAYFAST_NOTIFY_URL || "https://ghosthome.co.za/api/payfast-itn";

    if (!MERCHANT_ID || !MERCHANT_KEY || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL) {
      return res.status(500).json({ ok: false, error: "Missing PayFast configuration." });
    }

    // 2) Read payload (supports POST body JSON or URL query for quick testing)
    let payload = {};
    if (req.method === "POST") {
      try {
        payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      } catch {
        payload = {};
      }
    } else if (req.method === "GET") {
      payload = req.query || {};
    } else {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // Plans (very simple defaults; your UI can pass plan/billing if you want)
    const plan       = (payload.plan || "basic").toString();
    const billing    = (payload.billing || "monthly").toString();

    // Amounts (format to exactly two decimals)
    const amount = Number(payload.amount ?? 99).toFixed(2);          // “setup/first” amount
    const rAmount = Number(payload.recurring_amount ?? 99).toFixed(2);

    // 3) Build the FIELD SET that will be SENT to PayFast
    //   Do not include passphrase here — it’s only used in the signature string.
    //   Keep ONLY non-empty fields. PayFast sorts by key when verifying.
    const sendFields = {
      merchant_id:  MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url:   RETURN_URL,
      cancel_url:   CANCEL_URL,
      notify_url:   NOTIFY_URL,

      amount:       amount, // once-off/first amount
      item_name:    "Ghosthome Street Access - 2 cams / 1 account - Monthly",

      // Minimal recurring fields for a monthly subscription
      subscription_type: 1,         // 1 = recurring
      recurring_amount:  rAmount,   // what gets debited every cycle
      frequency:         3,         // 3 = monthly
      cycles:            0          // 0 = indefinite

      // If you want metadata later you can add e.g. custom_str1/2/3
      // custom_str2: plan,
      // custom_str3: billing,
    };

    // remove empties just in case
    Object.keys(sendFields).forEach((k) => {
      const v = sendFields[k];
      if (v === null || v === undefined || v === "") delete sendFields[k];
    });

    // 4) Build the signature BASE using the SAME encoder PayFast uses.
    //    Use URLSearchParams so spaces -> '+' (form encoding).
    //    Keys must be sorted A..Z and values trimmed; exclude 'signature'.
    const sortedKeys = Object.keys(sendFields).filter(k => k !== "signature").sort();

    const paramsForSignature = new URLSearchParams();
    for (const k of sortedKeys) {
      const val = String(sendFields[k]).trim();
      if (val !== "") paramsForSignature.append(k, val);
    }

    // Append &passphrase=... TO THE STRING USED FOR HASHING ONLY (do NOT send it)
    // Also URL-encode the passphrase the same way (URLSearchParams handles that)
    if (PASS) {
      const p = new URLSearchParams();
      p.append("passphrase", PASS);
      // IMPORTANT: append as raw “&passphrase=…” text to the signature string
      // using the same form-encoding style (spaces -> '+')
      const passChunk = `&${p.toString()}`; // e.g. "&passphrase=1234567891011"
      const base = paramsForSignature.toString() + passChunk;

      // 5) MD5
      var signature = crypto.createHash("md5").update(base, "utf8").digest("hex");

      // 6) Build redirect (the fields you SEND, plus 'signature')
      const qs = new URLSearchParams(paramsForSignature); // clone of the exact same encoding
      qs.append("signature", signature);

      const engine = MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

      const redirect = `${engine}?${qs.toString()}`;

      return res.status(200).json({
        ok: true,
        redirect,
        // --- diagnostics (visible while we stabilise; remove later) ---
        diag: {
          mode: MODE,
          base: base,              // exact string hashed
          signature,
          fields: Object.fromEntries(paramsForSignature.entries())
        }
      });
    } else {
      // If you don’t have a passphrase set in the PayFast dashboard, you must NOT
      // append passphrase in the base and you must also disable it in your account.
      const base = paramsForSignature.toString();
      const signature = crypto.createHash("md5").update(base, "utf8").digest("hex");

      const engine = MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

      const qs = new URLSearchParams(paramsForSignature);
      qs.append("signature", signature);

      return res.status(200).json({
        ok: true,
        redirect: `${engine}?${qs.toString()}`,
        diag: { mode: MODE, base, signature, fields: Object.fromEntries(paramsForSignature.entries()) }
      });
    }
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Server error" });
  }
}
