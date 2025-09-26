// Serverless function that builds a correct PayFast signature and
// returns an auto-submit POST form to the PayFast engine.

const crypto = require("crypto");

function buildSignature(fields, passphrase) {
  // Remove empty values; sort keys ASC; URL-encode each value
  const pairs = Object.keys(fields)
    .filter((k) => fields[k] !== undefined && fields[k] !== null && `${fields[k]}` !== "")
    .sort()
    .map((k) => `${k}=${encodeURIComponent(String(fields[k]).trim())}`);

  if (passphrase && String(passphrase).trim() !== "") {
    pairs.push(`passphrase=${encodeURIComponent(String(passphrase).trim())}`);
  }

  const base = pairs.join("&");
  const signature = crypto.createHash("md5").update(base).digest("hex");
  return { base, signature };
}

module.exports = async (req, res) => {
  try {
    const {
      PAYFAST_MODE = "sandbox",
      PAYFAST_MERCHANT_ID,
      PAYFAST_MERCHANT_KEY,
      PAYFAST_PASSPHRASE = "",
      PAYFAST_RETURN_URL,
      PAYFAST_CANCEL_URL,
      PAYFAST_NOTIFY_URL,
    } = process.env;

    if (!PAYFAST_MERCHANT_ID || !PAYFAST_MERCHANT_KEY || !PAYFAST_RETURN_URL || !PAYFAST_CANCEL_URL || !PAYFAST_NOTIFY_URL) {
      res.status(500).json({ ok: false, error: "Missing PayFast configuration env vars." });
      return;
    }

    const isSandbox = (PAYFAST_MODE || "sandbox").toLowerCase() === "sandbox";
    const engineUrl = isSandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

    // --- read plan/term from query (defaults) ---
    const plan = (req.query.plan || "basic").toLowerCase();          // basic | plus
    const term = (req.query.term || "monthly").toLowerCase();        // monthly | yearly
    const recurring = (req.query.recurring || "true") === "true";    // we use subscriptions

    // amounts (ZAR) – adjust as needed
    let amount = 99.00;
    let itemName = "Ghosthome Street Access - 2 cams / 1 account - Monthly";

    if (plan === "basic" && term === "yearly") { amount = 1099.00; itemName = "Ghosthome Street Access - 2 cams / 1 account - 12 months"; }
    if (plan === "plus"  && term === "monthly") { amount = 149.00; itemName = "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"; }
    if (plan === "plus"  && term === "yearly")  { amount = 1299.00; itemName = "Ghosthome Street Access - 4 cams / 2 accounts - 12 months"; }

    const itemDescription = "Community live-view access with night notifications (customisable hours).";

    // Build mandatory + subscription fields
    const baseFields = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: PAYFAST_RETURN_URL,
      cancel_url: PAYFAST_CANCEL_URL,
      notify_url: PAYFAST_NOTIFY_URL,
      item_name: itemName,
      item_description: itemDescription,
    };

    let fields;

    if (recurring && term === "monthly") {
      // Subscription: monthly, cycles=0 means indefinite
      fields = {
        ...baseFields,
        amount: Number(amount).toFixed(2),     // PayFast wants amount as string with 2 decimals (still included)
        subscription_type: 1,                  // 1 = subscription
        recurring_amount: Number(amount).toFixed(2),
        frequency: 3,                          // 3 = monthly
        cycles: 0,                             // 0 = indefinite
        // optional meta
        custom_str2: plan,
        custom_str3: "monthly",
      };
    } else if (recurring && term === "yearly") {
      // Yearly subscription – frequency 6 = bi-annual, 7 = annual (per docs)
      fields = {
        ...baseFields,
        amount: Number(amount).toFixed(2),
        subscription_type: 1,
        recurring_amount: Number(amount).toFixed(2),
        frequency: 7,                          // 7 = yearly
        cycles: 0,
        custom_str2: plan,
        custom_str3: "yearly",
      };
    } else {
      // Once-off fallback (not used in your flow, but safe)
      fields = {
        ...baseFields,
        amount: Number(amount).toFixed(2),
        custom_str2: plan,
        custom_str3: term,
      };
    }

    // Build signature
    const { base, signature } = buildSignature(fields, PAYFAST_PASSPHRASE);
    const debug = req.query.debug === "1";

    if (debug) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).end(JSON.stringify({
        ok: true,
        mode: isSandbox ? "sandbox" : "live",
        engineUrl,
        signature_base: base,
        fields: { ...fields, signature },
      }, null, 2));
      return;
    }

    // Return a tiny HTML page that auto-submits a POST to PayFast
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).end(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Redirecting to PayFast…</title></head>
<body onload="document.forms[0].submit()">
  <form action="${engineUrl}" method="post">
    ${Object.entries({ ...fields, signature })
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${String(v).replace(/"/g, "&quot;")}">`)
      .join("\n")}
    <noscript><button type="submit">Continue to PayFast</button></noscript>
  </form>
</body>
</html>`);
  } catch (err) {
    console.error("payfast-initiate error:", err);
    res.status(500).json({ ok: false, error: "Server error while preparing PayFast request." });
  }
};
