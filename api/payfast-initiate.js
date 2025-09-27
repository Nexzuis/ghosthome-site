// api/payfast-initiate.js — R99 monthly subscription, correct PayFast signature
import crypto from "crypto";

function urlencodePhp(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}
function md5Hex(str) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

export default async function handler(req, res) {
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

  // BASIC plan: R99.00 monthly
  const amount = "99.00";

  // Recurring subscription (PayFast)
  const fields = {
    amount,
    cancel_url: CANCEL_URL,
    cycles: 0,                // 0 = indefinite
    frequency: 3,             // 3 = monthly
    item_name: "Ghosthome Street Access - 2 cams / 1 account - Monthly",
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    notify_url: NOTIFY_URL,
    recurring_amount: amount,
    return_url: RETURN_URL,
    subscription_type: 1,     // 1 = subscription
  };

  // Build signature base: alpha sort, PHP urlencode, exclude signature
  const keys = Object.keys(fields).sort();
  const signatureBase =
    keys.map((k) => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`).join("&") +
    `&passphrase=${urlencodePhp(PASSPHRASE)}`;

  const signature = md5Hex(signatureBase);

  const sendFields = { ...fields, signature };

  const engine =
    MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

  const query = Object.keys(sendFields)
    .sort()
    .map((k) => `${k}=${urlencodePhp(sendFields[k])}`)
    .join("&");

  const redirect = `${engine}?${query}`;
  res.status(200).json({ ok: true, redirect });
}
