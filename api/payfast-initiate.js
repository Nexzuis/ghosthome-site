// /api/payfast-initiate.js
import crypto from "crypto";

const required = (name, v) => {
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
};

// PHP urlencode behaviour: encodeURIComponent, but spaces must be '+'
function phpUrlEncode(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}

function buildSignature(fields, passphrase) {
  // Remove empty values and "signature" itself
  const list = Object.entries(fields)
    .filter(([k, v]) => k !== "signature" && v !== undefined && v !== null && String(v) !== "");

  // Sort by key (ASCII)
  list.sort(([a], [b]) => a.localeCompare(b));

  // Build name=value pairs with PHP urlencode semantics
  const pairs = list.map(([k, v]) => `${phpUrlEncode(k)}=${phpUrlEncode(v)}`);

  if (passphrase) {
    pairs.push(`passphrase=${phpUrlEncode(passphrase)}`);
  }

  const base = pairs.join("&");
  const signature = crypto.createHash("md5").update(base).digest("hex");
  return { signature, base };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // You can pass plan/billing in the body; we only need amount & description here.
    const { plan = "basic", billing = "monthly" } = (req.body || {});

    // ----- ENV -----
    const MODE = process.env.PAYFAST_MODE || "sandbox"; // "sandbox" | "live"
    const MERCHANT_ID = required("PAYFAST_MERCHANT_ID", process.env.PAYFAST_MERCHANT_ID);
    const MERCHANT_KEY = required("PAYFAST_MERCHANT_KEY", process.env.PAYFAST_MERCHANT_KEY);
    const PASSPHRASE  = required("PAYFAST_PASSPHRASE", process.env.PAYFAST_PASSPHRASE);

    const RETURN_URL  = required("PAYFAST_RETURN_URL", process.env.PAYFAST_RETURN_URL);
    const CANCEL_URL  = required("PAYFAST_CANCEL_URL", process.env.PAYFAST_CANCEL_URL);
    const NOTIFY_URL  = required("PAYFAST_NOTIFY_URL", process.env.PAYFAST_NOTIFY_URL);

    // ----- PRICING -----
    // (Adjust if you add more)
    const catalogue = {
      basic: {
        monthly: { amount: 99.00, name: "Ghosthome Street Access - 2 cams / 1 account - Monthly" },
        yearly:  { amount: 1099.00, name: "Ghosthome Street Access - 2 cams / 1 account - 12 months" }
      },
      plus: {
        monthly: { amount: 149.00, name: "Ghosthome Street Access - 4 cams / 2 accounts - Monthly" },
        yearly:  { amount: 1299.00, name: "Ghosthome Street Access - 4 cams / 2 accounts - 12 months" }
      }
    };

    const entry = (catalogue[plan] && catalogue[plan][billing]) || catalogue.basic.monthly;
    const amount = Number(entry.amount).toFixed(2);
    const item_name = entry.name;

    const engine =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // ----- FIELDS TO SUBMIT (subscriptions via “simplified” fields) -----
    // For monthly/annual, use PayFast “recurring billing” fields.
    // frequency: 3 = monthly, 6 = biannual, 12 = annual (docs)
    const isMonthly = billing === "monthly";
    const recurring = {
      subscription_type: 1,
      recurring_amount: amount,      // Amount debited for each cycle
      frequency: isMonthly ? 3 : 12, // 3=monthly, 12=annual
      cycles: 0                      // 0 = continue until cancelled
    };

    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      amount: amount,                // upfront charge
      item_name,
      ...(recurring)
    };

    const { signature, base } = buildSignature(fields, PASSPHRASE);
    fields.signature = signature;

    // Optional debug (don’t expose passphrase)
    const debug = req.query?.debug
      ? { mode: MODE, signature_base: base, signature, fields }
      : undefined;

    return res.status(200).json({ ok: true, engine, fields, ...(debug ? { debug } : {}) });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}
