// api/payfast-initiate.js
import crypto from "crypto";

/** Encode a value exactly the way PayFast expects for signature building */
function pfEncode(value) {
  // encodeURIComponent + RFC3986 upper-case for the few extra chars
  return encodeURIComponent(String(value))
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

/** Build the PayFast signature base string from a fields object */
function buildSignatureString(fields, passphrase) {
  // include ONLY keys that exist and are not undefined or null
  const keys = Object.keys(fields)
    .filter((k) => fields[k] !== undefined && fields[k] !== null)
    .sort();

  const pairs = keys.map((k) => `${k}=${pfEncode(fields[k])}`);

  // If a passphrase is set on the account, it MUST be appended to the string
  if (passphrase && String(passphrase).length > 0) {
    pairs.push(`passphrase=${pfEncode(passphrase)}`);
  }
  return pairs.join("&");
}

function md5(str) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "Method Not Allowed" });
      return;
    }

    // ── ENV (must be set in Vercel → Settings → Environment Variables)
    const MODE = process.env.PAYFAST_MODE || "sandbox"; // "sandbox" | "live"
    const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
    const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
    const PASS = process.env.PAYFAST_PASSPHRASE || "";
    const RETURN_URL = process.env.PAYFAST_RETURN_URL; // e.g. https://ghosthome.co.za/pay?result=success
    const CANCEL_URL = process.env.PAYFAST_CANCEL_URL; // e.g. https://ghosthome.co.za/pay?result=cancel
    const NOTIFY_URL = process.env.PAYFAST_NOTIFY_URL; // e.g. https://ghosthome.co.za/api/payfast-itn

    if (!MERCHANT_ID || !MERCHANT_KEY || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL) {
      res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing: {
          PAYFAST_MERCHANT_ID: !!MERCHANT_ID,
          PAYFAST_MERCHANT_KEY: !!MERCHANT_KEY,
          PAYFAST_RETURN_URL: !!RETURN_URL,
          PAYFAST_CANCEL_URL: !!CANCEL_URL,
          PAYFAST_NOTIFY_URL: !!NOTIFY_URL,
        },
      });
      return;
    }

    // ── REQUEST (what the /pay page posts)
    const {
      plan = "basic",
      billing = "monthly",
      amount = "99",
      recurring = true,
      // optional future fields:
      // name_first, name_last, email_address
    } = req.body || {};

    // Amount as 2-decimals string
    const amt = Number.parseFloat(String(amount).replace(/[^\d.]/g, "") || "0").toFixed(2);

    // ── Base, same for sandbox & live; endpoint differs by MODE
    const endpoint =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // We construct ONE fields object and reuse it for signature and redirect.
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      amount: amt,
      item_name: "Ghosthome Street Access - 2 cams / 1 account - Monthly",
      item_description:
        "Community live-view access with night notifications (customisable hours).",

      // Custom metadata we want back in ITN
      custom_str2: plan,       // "basic" | "plus" etc.
      custom_str3: billing,    // "monthly" | "annual"

      // Recurring billing
      ...(recurring
        ? {
            subscription_type: 1,      // 1 = subscription
            recurring_amount: amt,     // same as amount for straight subs
            frequency: 3,              // 3 = monthly (PayFast codes)
            cycles: 0,                 // 0 = continue until cancelled
          }
        : {}),
    };

    // ── Signature (important: built from THE SAME fields object)
    const signatureBase = buildSignatureString(fields, PASS);
    const signature = md5(signatureBase);

    // attach to fields
    const signedFields = { ...fields, signature };

    // ── Build redirect query from *the same* signedFields set
    const query = Object.keys(signedFields)
      .sort()
      .map((k) => `${k}=${pfEncode(signedFields[k])}`)
      .join("&");

    const redirectUrl = `${endpoint}?${query}`;

    res.status(200).json({
      ok: true,
      url: redirectUrl,

      // helpful in case you need to see what PayFast will verify
      debug: {
        mode: MODE,
        signature_base: signatureBase,
        signature,
        fields: signedFields,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || "Server error" });
  }
}
