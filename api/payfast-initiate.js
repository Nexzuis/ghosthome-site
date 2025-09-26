// /api/payfast-initiate.js
// Vercel Node function (works in CJS and ESM deployments)

const crypto = require?.("crypto") || (await import("crypto")).default;

function env(name, fallback = undefined) {
  const v = process.env[name];
  if (v === undefined || v === null) return fallback;
  return String(v);
}

function trimAmount(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

// RFC3986 encode (spaces as %20, not '+')
function enc(v) {
  return encodeURIComponent(String(v)).replace(/%20/g, "%20");
}

// Build PayFast signature base (sorted keys, exclude empties, RFC3986 encoding)
function buildSignatureBase(fields, passphrase) {
  const cleaned = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    const s = String(v);
    if (s === "") continue; // exclude empties
    cleaned[k] = s;
  }
  const parts = Object.keys(cleaned)
    .sort((a, b) => a.localeCompare(b))
    .map((k) => `${k}=${enc(cleaned[k])}`);
  if (passphrase) parts.push(`passphrase=${enc(passphrase)}`);
  return parts.join("&");
}

// We’ll also build the actual redirect query with the SAME encoding
function buildQuery(fields) {
  const parts = [];
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    const s = String(v);
    if (s === "") continue;
    parts.push(`${k}=${enc(s)}`);
  }
  return parts.join("&");
}

async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "Method not allowed" });
      return;
    }

    const {
      plan = "basic",            // "basic" | "plus"
      billing = "monthly",       // "monthly" | "annual"
      amount,                    // string or number (optional; we’ll set if absent)
      buyerEmail,                // optional
      firstName,                 // optional
      lastName,                  // optional
      custom1,                   // optional free text
    } = req.body || {};

    const MODE = env("PAYFAST_MODE", "sandbox"); // "sandbox" | "live"
    const MERCHANT_ID = env("PAYFAST_MERCHANT_ID", "").trim();
    const MERCHANT_KEY = env("PAYFAST_MERCHANT_KEY", "").trim();
    const PASSPHRASE  = env("PAYFAST_PASSPHRASE", "");
    const RETURN_URL  = env("PAYFAST_RETURN_URL", "https://ghosthome.co.za/pay?result=success");
    const CANCEL_URL  = env("PAYFAST_CANCEL_URL", "https://ghosthome.co.za/pay?result=cancel");
    const NOTIFY_URL  = env("PAYFAST_NOTIFY_URL", "https://ghosthome.co.za/api/payfast-itn");

    // sanity checks
    const missing = [];
    if (!MERCHANT_ID) missing.push("PAYFAST_MERCHANT_ID");
    if (!MERCHANT_KEY) missing.push("PAYFAST_MERCHANT_KEY");
    if (!RETURN_URL) missing.push("PAYFAST_RETURN_URL");
    if (!CANCEL_URL) missing.push("PAYFAST_CANCEL_URL");
    if (!NOTIFY_URL) missing.push("PAYFAST_NOTIFY_URL");
    if (missing.length) {
      res.status(500).json({ ok: false, error: "Missing PayFast configuration", missing });
      return;
    }

    // product/plan mapping
    let label = "";
    let cents = 9900; // default R99.00
    if (plan === "basic" && billing === "monthly") { label = "Ghosthome Street Access - 2 cams / 1 account - Monthly"; cents = 9900; }
    else if (plan === "basic" && billing === "annual") { label = "Ghosthome Street Access - 2 cams / 1 account - Annual"; cents = 109900; }
    else if (plan === "plus"  && billing === "monthly") { label = "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"; cents = 14900; }
    else if (plan === "plus"  && billing === "annual") { label = "Ghosthome Street Access - 4 cams / 2 accounts - Annual"; cents = 129900; }
    const chosenAmount = amount ? trimAmount(amount) : trimAmount(cents / 100);

    // Recurring for monthly/annual; payfast frequency codes: 3=monthly, 6=bi-annual, 6 not used; 6-month cycles not needed.
    const isRecurring = billing === "monthly" || billing === "annual";
    const frequency   = billing === "annual" ? 6 : 3;     // PayFast: 6 = biannual, 5 = quarterly, 3 = monthly, 1 = daily, 2 = weekly
    const cycles      = 0; // 0 = indefinite

    // Build fields we will SEND to PayFast (exclude empties later)
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      amount: chosenAmount,
      item_name: label,
      item_description: "Community live-view access with night notifications (customisable hours).",

      // Optional buyer fields
      email_address: buyerEmail || undefined,
      name_first: firstName || undefined,
      name_last: lastName || undefined,

      // Our custom tracking
      custom_str1: custom1 || undefined,
      custom_str2: plan || undefined,
      custom_str3: billing || undefined,
    };

    if (isRecurring) {
      fields.subscription_type = 1;              // 1 = subscription
      fields.recurring_amount = chosenAmount;    // charge amount
      fields.frequency = frequency;              // 3 monthly / 6 bi-annual (using 6 for annual)
      fields.cycles = cycles;                    // 0 indefinite
    }

    // Signature base & MD5
    const base = buildSignatureBase(fields, PASSPHRASE);
    const signature = crypto.createHash("md5").update(base).digest("hex");

    // Redirect query (same encoding model as signature)
    const query = buildQuery({ ...fields, signature });

    const endpoint =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    const redirect = `${endpoint}?${query}`;

    res.status(200).json({
      ok: true,
      redirect,
      // uncomment for on-page debugging (do not leave enabled in production)
      // debug: { mode: MODE, signature_base: base, signature, fields },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}

// Support both ESM and CJS on Vercel
module.exports = handler;
module.exports.default = handler;
