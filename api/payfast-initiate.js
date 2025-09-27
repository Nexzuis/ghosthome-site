// api/payfast-initiate.js  (CommonJS + explicit node runtime)
const crypto = require("crypto");

function urlencodePhp(v) { return encodeURIComponent(String(v)).replace(/%20/g, "+"); }
function md5Hex(s) { return crypto.createHash("md5").update(s, "utf8").digest("hex"); }

async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    const MODE = (process.env.PAYFAST_MODE || "sandbox").trim().toLowerCase();
    const MERCHANT_ID = (process.env.PAYFAST_MERCHANT_ID || "").trim();
    const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const PASSPHRASE = (process.env.PAYFAST_PASSPHRASE || "").trim();
    const RETURN_URL = (process.env.PAYFAST_RETURN_URL || "").trim();
    const CANCEL_URL = (process.env.PAYFAST_CANCEL_URL || "").trim();
    const NOTIFY_URL = (process.env.PAYFAST_NOTIFY_URL || "").trim();

    if (!MERCHANT_ID || !MERCHANT_KEY || !PASSPHRASE || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL) {
      return res.status(400).json({ ok: false, error: "Missing PayFast configuration" });
    }

    const amount = "99.00"; // BASIC plan

    // Minimal, safe fields
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      subscription_type: 1,      // subscription
      frequency: 3,              // monthly
      amount: amount,            // initial amount
      recurring_amount: amount,  // monthly amount
      item_name: "Ghosthome Monthly",
    };

    // Signature (alpha sort + PHP urlencode + passphrase)
    const keys = Object.keys(fields).sort();
    const base = keys.map(k => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`).join("&")
                 + `&passphrase=${urlencodePhp(PASSPHRASE)}`;
    const signature = md5Hex(base);

    const engine = MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

    return res.status(200).json({ ok: true, engine, fields: { ...fields, signature } });
  } catch (e) {
    return res.status(200).json({ ok: false, error: `payfast-initiate crash: ${e?.message || e}` });
  }
}

module.exports = handler;
module.exports.config = { runtime: "nodejs" };
