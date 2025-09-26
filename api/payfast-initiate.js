// Builds a signed PayFast payload server-side, so your passphrase stays secret.
// Supports "subscription" style by default (monthly or annual) using frequency/cycles.
// ENV needed: PAYFAST_MODE=sandbox|live, PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE
//             PAYFAST_RETURN_URL, PAYFAST_CANCEL_URL, PAYFAST_NOTIFY_URL
//
// Notes:
// - For monthly: frequency=3 (monthly), cycles=0 (indefinite) if allowed by your PayFast account.
// - For annual: frequency=6 (bi-annual) is the closest standard. Many integrations do annual by amount*12 monthly,
//   but if you want true annual in PayFast, speak to PayFast support about supported frequencies on your account.

const crypto = require("crypto");

function encodeRFC3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function buildSignature(fields, passphrase) {
  // 1) Sort keys ascending
  const keys = Object.keys(fields).sort();
  // 2) Build query string (URL-encode values)
  const query = keys.map(k => `${k}=${encodeRFC3986(String(fields[k] ?? ""))}`).join("&");
  // 3) Append passphrase if present
  const withPass = passphrase ? `${query}&passphrase=${encodeRFC3986(passphrase)}` : query;
  // 4) MD5 hash
  return crypto.createHash("md5").update(withPass).digest("hex");
}

function pfEndpoint(mode) {
  // Standard redirect checkout endpoint
  return mode === "live"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    const {
      plan = "basic",         // basic | standard
      billing = "monthly",    // monthly | annual
      amount = 0,             // number
      signupId = "",          // uuid (optional)
      name = "",              // optional buyer name
      email = "",             // optional buyer email
    } = req.body || {};

    const mode = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const merchant_id = process.env.PAYFAST_MERCHANT_ID || "";
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY || "";
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const return_url = process.env.PAYFAST_RETURN_URL || "";
    const cancel_url = process.env.PAYFAST_CANCEL_URL || "";
    const notify_url = process.env.PAYFAST_NOTIFY_URL || "";

    if (!merchant_id || !merchant_key || !passphrase || !return_url || !cancel_url || !notify_url) {
      return res.status(500).json({ ok: false, error: "Missing PayFast configuration" });
    }

    // Normalised amounts
    const cents = (Number(amount) || 0).toFixed(2);

    // Subscription fields:
    // frequency: 3 (monthly) or approximate annual via 6/Other – confirm with PayFast if true annual not available on your account.
    const subscription = true;
    const frequency = billing === "monthly" ? 3 : 3; // default monthly cycle; see note above if you want true annual
    const cycles = 0; // 0 = indefinite (if allowed); otherwise pick a cycle count.

    const item_name = billing === "monthly"
      ? (plan === "standard" ? "Ghosthome Street Access — 4 cams / 2 accounts — Monthly"
                              : "Ghosthome Street Access — 2 cams / 1 account — Monthly")
      : (plan === "standard" ? "Ghosthome Street Access — 4 cams / 2 accounts — Annual"
                              : "Ghosthome Street Access — 2 cams / 1 account — Annual");

    const item_description = "Community live-view access with night notifications (customisable hours).";

    // Build base fields (no signature yet)
    const fields = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      amount: cents,
      item_name,
      item_description,
      email_address: email || undefined, // PayFast supports this
      name_first: name ? name.split(" ")[0] : undefined,
      name_last: name ? name.split(" ").slice(1).join(" ") : undefined,
      custom_str1: signupId || "",
      custom_str2: plan,
      custom_str3: billing,
    };

    if (subscription) {
      fields.subscription_type = 1; // 1 = subscription
      fields.recurring_amount = cents;
      fields.frequency = frequency; // 3 = monthly
      fields.cycles = cycles;       // 0 = indefinite
    }

    // Remove undefined
    Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

    // Sign
    const signature = buildSignature(fields, passphrase);
    fields.signature = signature;

    return res.status(200).json({
      ok: true,
      action: pfEndpoint(mode),
      fields,
    });
  } catch (e) {
    console.error("payfast-initiate error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
