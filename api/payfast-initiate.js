// ESM version — builds a signed PayFast payload server-side
// Required ENV:
//   PAYFAST_MODE = sandbox | live
//   PAYFAST_MERCHANT_ID
//   PAYFAST_MERCHANT_KEY
//   PAYFAST_PASSPHRASE
// Optional (auto-fills from host if empty):
//   PAYFAST_RETURN_URL, PAYFAST_CANCEL_URL, PAYFAST_NOTIFY_URL

import crypto from "node:crypto";

/** RFC3986 encoding (spaces => %20, not +) */
function encodeRFC3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Make sure text PayFast sees is clean ASCII (avoid curly quotes/em-dashes etc.) */
function sanitizePF(text) {
  if (text == null) return "";
  let t = String(text);
  // Replace smart punctuation with ASCII
  t = t.replace(/[–—−]/g, "-")
       .replace(/[“”„‟]/g, '"')
       .replace(/[’‘‚‛]/g, "'")
       .replace(/…/g, "...");
  // Strip non-printable / non-ASCII
  t = t.normalize("NFKD").replace(/[^\x20-\x7E]/g, "");
  // Collapse whitespace
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

/** Build signature from the EXACT fields we will post */
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

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const {
      plan = "basic",            // "basic" | "standard"
      billing = "monthly",       // "monthly" | "annual"  (we’ll still submit monthly flags for now)
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
    if (!passphrase)  missing.push("PAYFAST_PASSPHRASE");
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

    // Keep monthly flags for subscription (PayFast supports monthly frequency=3)
    const subscription = true;
    const frequency = 3; // monthly
    const cycles = 0;    // 0 = indefinite (if allowed)

    // IMPORTANT: keep names/descriptions ASCII only for consistent signing on PayFast side
    const item_name =
      billing === "monthly"
        ? (plan === "standard"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"
            : "Ghosthome Street Access - 2 cams / 1 account - Monthly")
        : (plan === "standard"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Annual"
            : "Ghosthome Street Access - 2 cams / 1 account - Annual");

    const item_description = "Community live-view access with night notifications (customisable hours).";

    const fields = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      amount: cents,
      item_name: sanitizePF(item_name),
      item_description: sanitizePF(item_description),
      email_address: email || undefined,
      name_first: sanitizePF(name ? name.split(" ")[0] : ""),
      name_last:  sanitizePF(name ? name.split(" ").slice(1).join(" ") : ""),
      custom_str1: signupId || "",
      custom_str2: plan,
      custom_str3: billing,
      // Recurring:
      subscription_type: subscription ? 1 : undefined,
      recurring_amount:  subscription ? cents : undefined,
      frequency:         subscription ? frequency : undefined,
      cycles:            subscription ? cycles : undefined
    };

    // Remove undefined so we only sign/post what exists
    Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

    const signature = buildSignature(fields, passphrase);
    fields.signature = signature;

    // Respond with endpoint + EXACT fields for the client to post (form posts the same object we signed)
    return res.status(200).json({ ok: true, action: pfEndpoint(mode), fields });
  } catch (e) {
    console.error("payfast-initiate fatal error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
