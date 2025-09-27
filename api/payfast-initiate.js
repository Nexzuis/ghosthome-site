const crypto = require("crypto");

function urlencodePhp(v) { return encodeURIComponent(String(v)).replace(/%20/g, "+"); }
function md5Hex(s) { return crypto.createHash("md5").update(s, "utf8").digest("hex"); }

async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    const env = process.env;
    const MODE = (env.PAYFAST_MODE || "sandbox").trim().toLowerCase();
    const fields = {
      merchant_id: (env.PAYFAST_MERCHANT_ID || "").trim(),
      merchant_key: (env.PAYFAST_MERCHANT_KEY || "").trim(),
      return_url: (env.PAYFAST_RETURN_URL || "").trim(),
      cancel_url: (env.PAYFAST_CANCEL_URL || "").trim(),
      notify_url: (env.PAYFAST_NOTIFY_URL || "").trim(),
      subscription_type: 1,
      frequency: 3,
      amount: "99.00",
      recurring_amount: "99.00",
      item_name: "Ghosthome Monthly"
    };
    const PASSPHRASE = (env.PAYFAST_PASSPHRASE || "").trim();

    // sanity
    for (const k of ["merchant_id","merchant_key","return_url","cancel_url","notify_url"]) {
      if (!fields[k]) return res.status(400).json({ ok: false, error: `Missing ${k}` });
    }
    if (!PASSPHRASE) return res.status(400).json({ ok: false, error: "Missing PASSPHRASE" });

    const base = Object.keys(fields).sort().map(k => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`).join("&")
               + `&passphrase=${urlencodePhp(PASSPHRASE)}`;
    const signature = md5Hex(base);

    const engine = MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

    res.status(200).json({ ok: true, engine, fields: { ...fields, signature } });
  } catch (e) {
    res.status(200).json({ ok: false, error: `payfast-initiate crash: ${e?.message || e}` });
  }
}
module.exports = handler;
module.exports.config = { runtime: "nodejs" };
