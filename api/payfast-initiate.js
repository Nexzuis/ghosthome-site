// api/payfast-initiate.js
import crypto from "crypto";

function required(name, value) {
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

function pfUrl(mode) {
  return mode === "live"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";
}

function formatAmount(a) {
  // Ensure "99.00" style string
  const n = Number(a);
  if (!Number.isFinite(n)) throw new Error(`Invalid amount: ${a}`);
  return n.toFixed(2);
}

function buildSignature(fields, passphrase) {
  // PayFast signature: alphabetically sort keys, urlencode values, append passphrase if set
  const ordered = Object.keys(fields).sort();
  const base =
    ordered.map((k) => `${k}=${encodeURIComponent(String(fields[k]))}`).join("&") +
    (passphrase ? `&passphrase=${encodeURIComponent(passphrase)}` : "");

  const md5 = crypto.createHash("md5").update(base).digest("hex");
  return { signature: md5, base };
}

export default async function handler(req, res) {
  // Always respond JSON (never throw past here)
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "Method Not Allowed" });
      return;
    }

    // ---- Read & validate incoming payload ----
    // Expected from /pay page:
    //   plan: 'basic' | 'plus'
    //   billing: 'monthly' | 'annual'
    //   amount: number|string
    //   recurring: boolean  (true for monthly subs; false for upfront 12-month once-off)
    const body = req.body || {};
    const plan = String(body.plan || "").trim();
    const billing = String(body.billing || "").trim();
    const recurring = !!body.recurring;
    const amount = formatAmount(body.amount ?? 0);

    if (!plan) throw new Error("Missing plan");
    if (!billing) throw new Error("Missing billing");

    // ---- Env config (all must be present) ----
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase(); // 'sandbox' | 'live'
    const MERCHANT_ID = required("PAYFAST_MERCHANT_ID", process.env.PAYFAST_MERCHANT_ID);
    const MERCHANT_KEY = required("PAYFAST_MERCHANT_KEY", process.env.PAYFAST_MERCHANT_KEY);
    const RETURN_URL = required("PAYFAST_RETURN_URL", process.env.PAYFAST_RETURN_URL);
    const CANCEL_URL = required("PAYFAST_CANCEL_URL", process.env.PAYFAST_CANCEL_URL);
    const NOTIFY_URL = required("PAYFAST_NOTIFY_URL", process.env.PAYFAST_NOTIFY_URL);
    const PASSPHRASE = process.env.PAYFAST_PASSPHRASE || ""; // may be empty on some accounts

    // ---- Build PayFast fields ----
    const itemNameMonthly =
      plan === "basic"
        ? "Ghosthome Street Access - 2 cams / 1 account - Monthly"
        : "Ghosthome Street Access - 4 cams / 2 accounts - Monthly";

    const itemNameAnnual =
      plan === "basic"
        ? "Ghosthome Street Access - 2 cams / 1 account - 12 months"
        : "Ghosthome Street Access - 4 cams / 2 accounts - 12 months";

    const description =
      "Community live-view access with night notifications (customisable hours).";

    const baseFields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      // custom fields (visible back via ITN)
      custom_str2: plan,    // plan
      custom_str3: billing, // billing period
    };

    let fields;

    if (recurring) {
      // Recurring subscription (monthly)
      fields = {
        ...baseFields,
        amount, // initial amount (PayFast requires this even for subs)
        item_name: itemNameMonthly,
        item_description: description,
        subscription_type: 1,
        recurring_amount: amount,
        frequency: 3, // 3 = monthly
        cycles: 0,    // 0 = indefinite
      };
    } else {
      // Once-off (12 months upfront)
      fields = {
        ...baseFields,
        amount, // full upfront amount
        item_name: itemNameAnnual,
        item_description: description,
      };
    }

    // ---- Sign correctly (sorted keys + optional passphrase) ----
    const { signature, base } = buildSignature(fields, PASSPHRASE);
    fields.signature = signature;

    // ---- Build redirect ----
    const redirect = pfUrl(MODE) + "?" + new URLSearchParams(fields).toString();

    // Helpful sandbox diagnostics
    const debug = {
      signature_base: base,
      signature,
      mode: MODE,
      fields,
    };

    res.status(200).json({
      ok: true,
      redirect,
      // Always include debug in sandbox to help you verify
      ...(MODE === "sandbox" ? { debug } : {}),
    });
  } catch (err) {
    // Never let the function crash without JSON
    res.status(200).json({
      ok: false,
      error: err?.message || String(err),
      code: "PAYFAST_INITIATE_ERROR",
    });
  }
}
