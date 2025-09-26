// Serverless function: signs PayFast params and returns them to the client.
// The client will build an HTML <form> and post directly to PayFast.
//
// Env needed (already in your Vercel project):
// PAYFAST_MODE            -> "sandbox" or "live"
// PAYFAST_MERCHANT_ID     -> e.g. 10042021
// PAYFAST_MERCHANT_KEY    -> e.g. v68b8l9og5zqx
// PAYFAST_PASSPHRASE      -> your passphrase (must match PayFast dashboard)
// PAYFAST_RETURN_URL      -> https://ghosthome.co.za/pay?result=success
// PAYFAST_CANCEL_URL      -> https://ghosthome.co.za/pay?result=cancel
// PAYFAST_NOTIFY_URL      -> https://ghosthome.co.za/api/payfast-itn

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const {
      plan = "basic",
      billing = "monthly", // "monthly" | "annual"
      amount = 99,         // number or string
      itemName,
      itemDescription,
    } = req.body || {};

    const {
      PAYFAST_MODE,
      PAYFAST_MERCHANT_ID,
      PAYFAST_MERCHANT_KEY,
      PAYFAST_PASSPHRASE,
      PAYFAST_RETURN_URL,
      PAYFAST_CANCEL_URL,
      PAYFAST_NOTIFY_URL,
    } = process.env;

    // quick config checks
    const missing = [];
    if (!PAYFAST_MODE) missing.push("PAYFAST_MODE");
    if (!PAYFAST_MERCHANT_ID) missing.push("PAYFAST_MERCHANT_ID");
    if (!PAYFAST_MERCHANT_KEY) missing.push("PAYFAST_MERCHANT_KEY");
    if (!PAYFAST_PASSPHRASE) missing.push("PAYFAST_PASSPHRASE");
    if (!PAYFAST_RETURN_URL) missing.push("PAYFAST_RETURN_URL");
    if (!PAYFAST_CANCEL_URL) missing.push("PAYFAST_CANCEL_URL");
    if (!PAYFAST_NOTIFY_URL) missing.push("PAYFAST_NOTIFY_URL");

    if (missing.length) {
      return res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing,
      });
    }

    // Endpoints
    const endpoint =
      PAYFAST_MODE === "live"
        ? "https://www.payfast.co.za/eng/process"
        : "https://sandbox.payfast.co.za/eng/process";

    // Format amounts as strings "99.00"
    const amt = (Number(amount) || 0).toFixed(2);

    // PayFast params (blank values must be excluded from signature)
    const fields = {
      merchant_id: String(PAYFAST_MERCHANT_ID),
      merchant_key: String(PAYFAST_MERCHANT_KEY),
      return_url: PAYFAST_RETURN_URL,
      cancel_url: PAYFAST_CANCEL_URL,
      notify_url: PAYFAST_NOTIFY_URL,

      amount: amt,
      item_name:
        itemName ||
        (billing === "annual"
          ? "Ghosthome Street Access - 2 cams / 1 account - Annual"
          : "Ghosthome Street Access - 2 cams / 1 account - Monthly"),
      item_description:
        itemDescription ||
        "Community live-view access with night notifications (customisable hours).",

      // custom strings so we can reconcile later
      custom_str1: "",            // free text if needed later
      custom_str2: String(plan),  // plan key
      custom_str3: String(billing),

      // subscription settings
      subscription_type: 1,            // 1 = subscription
      recurring_amount: amt,           // required for subs
      frequency: billing === "annual" ? 6 : 3, // 6=bi-annual (12 is not supported), 3=monthly
      cycles: 0,                       // 0 = indefinite
    };

    // Create signature base string per PayFast rules:
    // 1) Only include fields with non-empty values
    // 2) Sort by key, then key=value with values URL-encoded (RFC1738)
    // 3) Append &passphrase=... at the end (also URL-encoded)
    const ordered = Object.keys(fields)
      .filter((k) => fields[k] !== undefined && fields[k] !== null && fields[k] !== "")
      .sort()
      .map((k) => `${k}=${encodeURIComponent(String(fields[k]).trim()).replace(/%20/g, "+")}`)
      .join("&");

    const signatureBase = `${ordered}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE).replace(/%20/g, "+")}`;

    // MD5 signature (node crypto)
    const crypto = await import("crypto");
    const signature = crypto.createHash("md5").update(signatureBase).digest("hex");

    // Server returns the endpoint + signed fields; client will build a form and POST directly to PayFast
    return res.status(200).json({
      ok: true,
      mode: PAYFAST_MODE,
      endpoint,
      fields: { ...fields, signature },
      // helpful diagnostics (safe to return — no passphrase leaked, only the base)
      diagnostics: {
        signature_base: signatureBase,
      },
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message || "Unknown server error",
    });
  }
}
