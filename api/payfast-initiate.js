// api/payfast-initiate.js
const crypto = require("crypto");

const required = (key, value) => {
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
};

const asMoney = (n) =>
  (typeof n === "number" ? n : parseFloat(String(n || "0")))
    .toFixed(2);

function buildSignature(fields, passphrase) {
  // PayFast requires: sort by key (case-insensitive ascending), skip empty values
  const pairs = Object.keys(fields)
    .filter((k) => fields[k] !== undefined && fields[k] !== null && fields[k] !== "")
    .sort((a, b) => a.localeCompare(b))
    .map((k) => `${k}=${encodeURIComponent(String(fields[k]).trim())}`);

  if (passphrase) {
    pairs.push(`passphrase=${encodeURIComponent(passphrase.trim())}`);
  }
  const base = pairs.join("&");
  const md5 = crypto.createHash("md5").update(base).digest("hex");
  return { base, md5 };
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "Method not allowed" });
      return;
    }

    // ==== ENV ====
    const MODE = process.env.PAYFAST_MODE || "sandbox"; // "sandbox" | "live"
    const merchant_id = required("PAYFAST_MERCHANT_ID", process.env.PAYFAST_MERCHANT_ID);
    const merchant_key = required("PAYFAST_MERCHANT_KEY", process.env.PAYFAST_MERCHANT_KEY);
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const return_url = required("PAYFAST_RETURN_URL", process.env.PAYFAST_RETURN_URL);
    const cancel_url = required("PAYFAST_CANCEL_URL", process.env.PAYFAST_CANCEL_URL);
    const notify_url = required("PAYFAST_NOTIFY_URL", process.env.PAYFAST_NOTIFY_URL);

    const endpoint =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // ==== INPUT (from your pay page) ====
    const { plan, billing, amount, email, name, phone, address } = req.body || {};
    const amt = asMoney(amount || 0);

    // pick labels
    const isMonthly = (billing || "monthly") === "monthly";
    const item_name =
      plan === "plus"
        ? (isMonthly
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"
            : "Ghosthome Street Access - 4 cams / 2 accounts - Annual")
        : (isMonthly
            ? "Ghosthome Street Access - 2 cams / 1 account - Monthly"
            : "Ghosthome Street Access - 2 cams / 1 account - Annual");

    const item_description =
      "Community live-view access with night notifications (customisable hours).";

    // Build fields (PayFast)
    const fields = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      amount: amt,                      // initial amount (same as recurring_amount for subs)
      item_name,
      item_description,
      // Identify plan in custom strings (no PII here)
      custom_str2: plan || "basic",
      custom_str3: isMonthly ? "monthly" : "annual",
      // Recurring billing (Subscriptions)
      subscription_type: 1,             // 1 = subscription
      recurring_amount: amt,
      frequency: isMonthly ? 3 : 6,     // 3 = monthly, 6 = bi-annual (closest for “annual” in sandbox); change to 6/12 as you prefer
      cycles: 0                         // 0 = indefinite
    };

    const { base, md5 } = buildSignature(fields, passphrase);
    const redirect = `${endpoint}?${Object.entries(fields)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&")}&signature=${md5}`;

    res.status(200).json({
      ok: true,
      redirect,
      debug: process.env.NODE_ENV === "development" ? { signature_base: base, signature: md5, mode: MODE, fields } : undefined
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
};
