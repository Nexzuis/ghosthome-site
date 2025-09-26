// api/payfast-initiate.js
import crypto from "crypto";
import { URLSearchParams } from "url";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ ok: false, error: "Method not allowed. Use POST." });
    }

    // ---- ENV ----
    const MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase(); // "sandbox" | "live"
    const MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
    const MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
    const PASS = process.env.PAYFAST_PASSPHRASE || ""; // if empty, we won't append
    const RETURN_URL = process.env.PAYFAST_RETURN_URL; // e.g. https://ghosthome.co.za/pay?result=success
    const CANCEL_URL = process.env.PAYFAST_CANCEL_URL; // e.g. https://ghosthome.co.za/pay?result=cancel
    const NOTIFY_URL = process.env.PAYFAST_NOTIFY_URL; // e.g. https://ghosthome.co.za/api/payfast-itn

    // Basic env validation so we never send HTML back
    const missing = [];
    [["PAYFAST_MERCHANT_ID", MERCHANT_ID],
     ["PAYFAST_MERCHANT_KEY", MERCHANT_KEY],
     ["PAYFAST_RETURN_URL", RETURN_URL],
     ["PAYFAST_CANCEL_URL", CANCEL_URL],
     ["PAYFAST_NOTIFY_URL", NOTIFY_URL],
     ["PAYFAST_MODE", MODE]].forEach(([k, v]) => { if (!v) missing.push(k); });

    if (missing.length) {
      return res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing,
      });
    }

    // ---- BODY (secure street page sends plan + billing) ----
    const { plan = "basic", billing = "monthly", amount } = req.body || {};
    // Derive amounts if not supplied
    const cents99 = (n) => Number(n).toFixed(2);
    const amt = amount ? cents99(amount) :
      plan === "basic" ? "99.00" :
      plan === "plus"  ? "149.00" :
      "99.00";
    const itemName = plan === "basic"
      ? "Ghosthome Street Access - 2 cams / 1 account - Monthly"
      : "Ghosthome Street Access - 4 cams / 2 accounts - Monthly";

    // PayFast recurring: frequency=3 (monthly), cycles=0 (indefinite)
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      amount: amt,                             // once-off price used by PF UI; we also send recurring_amount
      item_name: itemName,
      item_description:
        "Community live-view access with night notifications (customisable hours).",
      // Custom notes for your admin:
      custom_str2: plan,                        // "basic" | "plus"
      custom_str3: billing,                     // "monthly" | "annual" (if you add it later)

      // Recurring billing flags:
      subscription_type: 1,                     // 1 = subscription
      recurring_amount: amt,                    // amount billed each cycle
      frequency: 3,                             // 3 = monthly
      cycles: 0,                                // 0 = indefinite
    };

    // IMPORTANT: remove empty/undefined keys before signing
    Object.keys(fields).forEach((k) => {
      if (fields[k] === undefined || fields[k] === null || fields[k] === "") {
        delete fields[k];
      }
    });

    // ---- SIGNATURE (PayFast spec)
    // 1) Sort keys alphabetically
    const sortedKeys = Object.keys(fields).sort();
    // 2) Build "key=value" with URL-encoded values
    const baseString = sortedKeys
      .map((k) => `${k}=${encodeURIComponent(String(fields[k]).trim())}`)
      .join("&");
    // 3) If you use a passphrase, append &passphrase=<urlencoded>
    const signBase = PASS ? `${baseString}&passphrase=${encodeURIComponent(PASS)}` : baseString;
    const signature = crypto.createHash("md5").update(signBase).digest("hex");

    // Fields sent to PayFast INCLUDE the signature but NOT the passphrase
    const payload = { ...fields, signature };

    // Redirect target (PayFast engine endpoint)
    const engine =
      MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // We redirect via the client (top-level navigation), not from fetch().
    // Send a JSON with a full URL (GET with query) so the client can window.location = url
    const qs = new URLSearchParams(payload).toString();
    const redirect = `${engine}?${qs}`;

    return res.status(200).json({
      ok: true,
      redirect,
      // helpful during sandbox testing:
      debug: {
        signature_base: signBase,
        signature,
        mode: MODE,
        fields: payload,
      },
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message || "Unknown error",
    });
  }
}
