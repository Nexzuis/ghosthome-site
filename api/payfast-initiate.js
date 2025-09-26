// /api/payfast-initiate.js
import crypto from "node:crypto";

export default async function handler(req, res) {
  // This endpoint only accepts POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const {
      plan = "basic",              // "basic" | "plus"
      billing = "monthly",         // "monthly" | "annual"
      amount = 99,                 // number
    } = req.body || {};

    // --- Env checks
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const ENGINE =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    const MID   = process.env.PAYFAST_MERCHANT_ID;
    const MKEY  = process.env.PAYFAST_MERCHANT_KEY;
    const PASS  = process.env.PAYFAST_PASSPHRASE || "";
    const RURL  = process.env.PAYFAST_RETURN_URL;
    const CURL  = process.env.PAYFAST_CANCEL_URL;
    const NURL  = process.env.PAYFAST_NOTIFY_URL;

    if (!MID || !MKEY || !RURL || !CURL || !NURL) {
      return res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing: {
          PAYFAST_MERCHANT_ID: !!MID,
          PAYFAST_MERCHANT_KEY: !!MKEY,
          PAYFAST_RETURN_URL: !!RURL,
          PAYFAST_CANCEL_URL: !!CURL,
          PAYFAST_NOTIFY_URL: !!NURL,
        },
      });
    }

    // --- Build PayFast fields (subscription)
    // frequency: 3 = monthly, cycles: 0 = indefinite
    const niceAmount = Number(amount).toFixed(2);
    const itemName =
      billing === "monthly"
        ? (plan === "plus"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"
            : "Ghosthome Street Access - 2 cams / 1 account - Monthly")
        : (plan === "plus"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - 12 months"
            : "Ghosthome Street Access - 2 cams / 1 account - 12 months");

    const fields = {
      merchant_id: MID,
      merchant_key: MKEY,
      return_url: RURL,
      cancel_url: CURL,
      notify_url: NURL,
      amount: niceAmount,
      item_name: itemName,
      // recurring billing:
      subscription_type: 1,
      recurring_amount: niceAmount,
      frequency: 3,
      cycles: 0,
    };

    // --- Signature per PayFast spec:
    // 1) Sort keys ascending
    // 2) URL-encode values
    // 3) Join as querystring
    // 4) Append &passphrase=YOUR_PASSPHRASE (if set)
    // 5) MD5 hash
    const encForSig = new URLSearchParams();
    Object.keys(fields)
      .sort()
      .forEach((k) => encForSig.append(k, String(fields[k])));

    if (PASS) encForSig.append("passphrase", PASS);

    const signature = crypto
      .createHash("md5")
      .update(encForSig.toString(), "utf8")
      .digest("hex");

    // Add signature to outgoing fields
    const outgoing = { ...fields, signature };

    // Final redirect URL
    const qs = new URLSearchParams();
    Object.keys(outgoing).forEach((k) => qs.append(k, String(outgoing[k])));
    const redirect = `${ENGINE}?${qs.toString()}`;

    return res.status(200).json({
      ok: true,
      redirect,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
}
