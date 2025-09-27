// api/payfast-initiate.js
// Node.js Serverless Function (explicit runtime), returns fields for POST form

export const config = { runtime: "nodejs20.x" };

import crypto from "crypto";

function urlencodePhp(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}
function md5Hex(str) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "Method not allowed" });
      return;
    }

    const MODE = (process.env.PAYFAST_MODE || "sandbox").trim().toLowerCase();
    const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID || "").trim();
    const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const PASSPHRASE = (process.env.PAYFAST_PASSPHRASE || "").trim();
    const RETURN_URL = (process.env.PAYFAST_RETURN_URL || "").trim();
    const CANCEL_URL = (process.env.PAYFAST_CANCEL_URL || "").trim();
    const NOTIFY_URL = (process.env.PAYFAST_NOTIFY_URL || "").trim();

    if (!MERCHANT_ID || !MERCHANT_KEY || !PASSPHRASE || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL) {
      res.status(400).json({ ok: false, error: "Missing PayFast configuration" });
      return;
    }

    const amount = "99.00"; // BASIC plan
    // Minimal + safe field set
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      subscription_type: 1,       // subscription
      frequency: 3,               // monthly
      amount: amount,             // initial charge
      recurring_amount: amount,   // monthly
      item_name: "Ghosthome Monthly",
    };

    // Signature base: alpha sort + PHP urlencode + append passphrase
    const keys = Object.keys(fields).sort();
    const base =
      keys.map(k => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`).join("&") +
      `&passphrase=${urlencodePhp(PASSPHRASE)}`;

    const signature = md5Hex(base);

    const engine =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    res.status(200).json({
      ok: true,
      engine,
      fields: { ...fields, signature },
    });
  } catch (e) {
    // Return the message so you see it on the page instead of a generic 500
    res.status(200).json({ ok: false, error: `payfast-initiate crash: ${e?.message || e}` });
  }
}
