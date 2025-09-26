// ESM serverless function for starting a PayFast checkout
// Alias path to avoid extensions that block 'payfast' in XHR URLs.
// Keeps ASCII sanitising and x-www-form-urlencoded (“+”) signature encoding.

import crypto from "node:crypto";

/** Encode exactly like application/x-www-form-urlencoded (spaces -> "+") */
function encodeForm(str) {
  return encodeURIComponent(str)
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Clean text so PayFast & hashing see the same ASCII bytes */
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

/** Build MD5 signature using the exact form-encoded base string (return both for sandbox debug) */
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
      plan = "basic",
      billing = "monthly",
      amount = 0,
      signupId = "",
      name = "",
      email = "",
    } = req.body || {};

    const mode = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const merchant_id = (process.env.PAYFAST_MERCHANT_ID || "").trim();
    const merchant_key = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const passphrase  = (process.env.PAYFAST_PASSPHRASE  || "").trim();

    // Build default URLs from current host if not provided
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

    // Treat all as subscriptions; monthly (frequency=3). Annual can be handled later with a different product.
    const subscription = true;
    const frequency = 3; // monthly
    const cycles = 0;    // indefinite

    const item_name =
      billing === "monthly"
        ? (plan === "standard"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"
            : "Ghosthome Street Access - 2 cams / 1 account - Monthly")
        : (plan === "standard"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Annual"
            : "Ghosthome Street Access - 2 cams / 1 account - Annual");

    const item_description = "Community live-view access with night notifications (customisable hours).";

    // Exact field set to post & sign
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
      // Recurring flags
      subscription_type: subscription ? 1 : undefined,
      recurring_amount:  subscription ? cents : undefined,
      frequency:         subscription ? frequency : undefined,
      cycles:            subscription ? cycles : undefined
    };

    Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

    const { signature, base: signature_base } = buildSignatureAndBase(fields, passphrase);
    fields.signature = signature;

    const debug = mode === "sandbox" ? { debug_signature_base: signature_base } : {};

    return res.status(200).json({ ok: true, action: pfEndpoint(mode), fields, ...debug });
  } catch (e) {
    console.error("pf-init fatal error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
