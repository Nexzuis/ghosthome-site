// ESM version — builds a signed PayFast payload server-side
// Required ENV:
//   PAYFAST_MODE = sandbox | live
//   PAYFAST_MERCHANT_ID
//   PAYFAST_MERCHANT_KEY
//   PAYFAST_PASSPHRASE
// Optional (auto-fills from host if empty):
//   PAYFAST_RETURN_URL, PAYFAST_CANCEL_URL, PAYFAST_NOTIFY_URL

import crypto from "node:crypto";

/**
 * PayFast expects the signature to be generated using the
 * exact same encoding as an HTML x-www-form-urlencoded POST.
 * That means spaces MUST be "+" (not %20).
 */
function encodeForm(str) {
  return encodeURIComponent(str)
    .replace(/%20/g, "+") // ← the critical bit for PayFast
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Keep descriptions strictly ASCII to avoid cross-encoding drift */
function sanitizePF(text) {
  if (text == null) return "";
  let t = String(text);
  t = t.replace(/[–—−]/g, "-")
       .replace(/[“”„‟]/g, '"')
       .replace(/[’‘‚‛]/g, "'")
       .replace(/…/g, "...");
  t = t.normalize("NFKD").replace(/[^\x20-\x7E]/g, "");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

/** Build signature AND return the exact base string we hashed (for sandbox debug) */
function buildSignatureAndBase(fields, passphrase) {
  const keys = Object.keys(fields).sort();
  const query = keys.map(k => `${k}=${encodeForm(String(fields[k] ?? ""))}`).join("&");
  const withPass = passphrase ? `${query}&passphrase=${encodeForm(passphrase)}` : query;
  const signature = crypto.createHash("md5").update(withPass).digest("hex");
  return { signature, base: withPass };
}

function pfEndpoint(mode) {
  return mode === "live"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const {
      plan = "basic",            // "basic" | "standard"
      billing = "monthly",       // "monthly" | "annual"
      amount = 0,
      signupId = "",
      name = "",
      email = "",
    } = req.body || {};

    const mode = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const merchant_id = (process.env.PAYFAST_MERCHANT_ID || "").trim();
    const merchant_key = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const passphrase  = (process.env.PAYFAST_PASSPHRASE  || "").trim();

    // Auto-fill return/cancel/notify from current host if not provided
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "").replace(/\/+$/, "");
    const base = host ? `https://${host}` : "";
    const return_url = (process.env.PAYFAST_RETURN_URL || (base ? `${base}/pay?result=success` : "")).trim();
    const cancel_url = (process.env.PAYFAST_CANCEL_URL || (base ? `${base}/pay?result=cancel` : "")).trim();
    const notify_url = (process.env.PAYFAST_NOTIFY_URL || (base ? `${base}/api/payfast-itn` : "")).trim();

    const missing = [];
    if (!merchant_id) missing.push("PAYFAST_MERCHANT_ID");
    if (!merchant_key) missing.push("PAYFAST_MERCHANT_KEY");
    if (!return_url)  missing.push("PAYFAST_RETURN_URL");
    if (!cancel_url)  missing.push("PAYFAST_CANCEL_URL");
    if (!notify_url)  missing.push("PAYFAST_NOTIFY_URL");
    if (missing.length) {
      console.error("PayFast config missing:", missing);
      return res.status(500).json({ ok: false, error: "Missing PayFast configuration", missing });
    }

    const cents = (Number(amount) || 0).toFixed(2);
    if (Number(cents) <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount" });
    }

    // Subscriptions: monthly (frequency=3). Annual will still run via monthly subscription for now.
    const subscription = true;
    const frequency = 3; // monthly
    const cycles = 0;    // indefinite

    // ASCII-only names help avoid signature drift
    const item_name =
      billing === "monthly"
        ? (plan === "standard"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"
            : "Ghosthome Street Access - 2 cams / 1 account - Monthly")
        : (plan === "standard"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Annual"
            : "Ghosthome Street Access - 2 cams / 1 account - Annual");

    const item_description = "Community live-view access with night notifications (customisable hours).";

    // EXACT set of fields we will post
    const fields = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      amount: cents,
      item_name: sanitizePF(item_name),
      item_description: sanitizePF(item_description),
      email_address: email ? sanitizePF(email) : undefined,
      name_first: name ? sanitizePF(name.split(" ")[0]) : undefined,
      name_last:  name ? sanitizePF(name.split(" ").slice(1).join(" ")) : undefined,
      custom_str1: signupId || "",
      custom_str2: plan,
      custom_str3: billing,
      // Recurring:
      subscription_type: subscription ? 1 : undefined,
      recurring_amount:  subscription ? cents : undefined,
      frequency:         subscription ? frequency : undefined,
      cycles:            subscription ? cycles : undefined
    };

    // Remove undefined to match the posted form exactly
    Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

    const { signature, base: signature_base } = buildSignatureAndBase(fields, passphrase);
    fields.signature = signature;

    // Include signature_base for sandbox debug so you can compare if needed
    const debug = mode === "sandbox" ? { debug_signature_base: signature_base } : {};

    return res.status(200).json({ ok: true, action: pfEndpoint(mode), fields, ...debug });
  } catch (e) {
    console.error("payfast-initiate fatal error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
