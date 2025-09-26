// Builds a signed PayFast payload server-side, so your passphrase stays secret.
// ENV needed: PAYFAST_MODE=sandbox|live, PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE
// Optional (auto-fills if blank): PAYFAST_RETURN_URL, PAYFAST_CANCEL_URL, PAYFAST_NOTIFY_URL

const crypto = require("crypto");

function encodeRFC3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function buildSignature(fields, passphrase) {
  const keys = Object.keys(fields).sort();
  const query = keys.map(k => `${k}=${encodeRFC3986(String(fields[k] ?? ""))}`).join("&");
  const withPass = passphrase ? `${query}&passphrase=${encodeRFC3986(passphrase)}` : query;
  return crypto.createHash("md5").update(withPass).digest("hex");
}

function pfEndpoint(mode) {
  return mode === "live"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const {
      plan = "basic",         // "basic" | "standard"
      billing = "monthly",    // "monthly" | "annual"
      amount = 0,
      signupId = "",
      name = "",
      email = "",
    } = req.body || {};

    const mode = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const merchant_id = (process.env.PAYFAST_MERCHANT_ID || "").trim();
    const merchant_key = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const passphrase = (process.env.PAYFAST_PASSPHRASE || "").trim();

    // Auto-fill return/cancel/notify from current host if not provided
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "").replace(/\/+$/, "");
    const base = host ? `https://${host}` : "";
    const return_url = (process.env.PAYFAST_RETURN_URL || (base ? `${base}/pay?result=success` : "")).trim();
    const cancel_url = (process.env.PAYFAST_CANCEL_URL || (base ? `${base}/pay?result=cancel` : "")).trim();
    const notify_url = (process.env.PAYFAST_NOTIFY_URL || (base ? `${base}/api/payfast-itn` : "")).trim();

    const missing = [];
    if (!merchant_id) missing.push("PAYFAST_MERCHANT_ID");
    if (!merchant_key) missing.push("PAYFAST_MERCHANT_KEY");
    if (!passphrase) missing.push("PAYFAST_PASSPHRASE");
    if (!return_url) missing.push("PAYFAST_RETURN_URL");
    if (!cancel_url) missing.push("PAYFAST_CANCEL_URL");
    if (!notify_url) missing.push("PAYFAST_NOTIFY_URL");

    if (missing.length) {
      console.error("PayFast config missing:", missing);
      return res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing
      });
    }

    const cents = (Number(amount) || 0).toFixed(2);
    if (Number(cents) <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount" });
    }

    // Subscription (monthly for now)
    const subscription = true;
    const frequency = billing === "monthly" ? 3 : 3; // use monthly until PayFast enables a true annual frequency on your account
    const cycles = 0; // 0 = indefinite if allowed

    const item_name = billing === "monthly"
      ? (plan === "standard" ? "Ghosthome Street Access — 4 cams / 2 accounts — Monthly"
                              : "Ghosthome Street Access — 2 cams / 1 account — Monthly")
      : (plan === "standard" ? "Ghosthome Street Access — 4 cams / 2 accounts — Annual"
                              : "Ghosthome Street Access — 2 cams / 1 account — Annual");

    const item_description = "Community live-view access with night notifications (customisable hours).";

    const fields = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      amount: cents,
      item_name,
      item_description,
      email_address: email || undefined,
      name_first: name ? name.split(" ")[0] : undefined,
      name_last: name ? name.split(" ").slice(1).join(" ") : undefined,
      custom_str1: signupId || "",
      custom_str2: plan,
      custom_str3: billing,
      subscription_type: subscription ? 1 : undefined,
      recurring_amount: subscription ? cents : undefined,
      frequency: subscription ? frequency : undefined,
      cycles: subscription ? cycles : undefined
    };

    Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

    const signature = buildSignature(fields, passphrase);
    fields.signature = signature;

    return res.status(200).json({
      ok: true,
      action: pfEndpoint(mode),
      fields
    });
  } catch (e) {
    console.error("payfast-initiate fatal error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
