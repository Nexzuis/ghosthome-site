// api/payfast-initiate.js
const crypto = require("crypto");

function safeVal(v) {
  return v === undefined || v === null ? "" : String(v);
}

function buildSignature(fields, passphrase) {
  // 1) drop empty + signature
  const filtered = {};
  for (const [k, v] of Object.entries(fields || {})) {
    if (k === "signature") continue;
    const sv = safeVal(v);
    if (sv !== "") filtered[k] = sv;
  }
  // 2) sort keys
  const pairs = Object.keys(filtered)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(filtered[k]).replace(/%20/g, "+")}`);

  // 3) include passphrase if present (sandbox shows “Salt Passphrase” – must be appended)
  if (passphrase) {
    pairs.push(
      `passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    );
  }

  const base = pairs.join("&");
  const signature = crypto.createHash("md5").update(base).digest("hex");
  return { base, signature };
}

function chosenEndpoint(mode) {
  return mode === "live"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // Body payload from the /pay page
    let body = {};
    try {
      body = req.body && typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    } catch {
      body = {};
    }

    // ENV
    const {
      PAYFAST_MERCHANT_ID,
      PAYFAST_MERCHANT_KEY,
      PAYFAST_PASSPHRASE,
      PAYFAST_MODE,
      PAYFAST_RETURN_URL,
      PAYFAST_CANCEL_URL,
      PAYFAST_NOTIFY_URL,
    } = process.env;

    // quick validations
    const missing = [];
    if (!PAYFAST_MERCHANT_ID) missing.push("PAYFAST_MERCHANT_ID");
    if (!PAYFAST_MERCHANT_KEY) missing.push("PAYFAST_MERCHANT_KEY");
    if (!PAYFAST_RETURN_URL) missing.push("PAYFAST_RETURN_URL");
    if (!PAYFAST_CANCEL_URL) missing.push("PAYFAST_CANCEL_URL");
    if (!PAYFAST_NOTIFY_URL) missing.push("PAYFAST_NOTIFY_URL");
    if (!PAYFAST_MODE) missing.push("PAYFAST_MODE");

    if (missing.length) {
      return res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing,
      });
    }

    // plan info coming from the page
    const plan = safeVal(body.plan || "basic");           // "basic" | "plus"
    const billing = safeVal(body.billing || "monthly");   // "monthly" | "annual"
    const amount = Number(body.amount || 99).toFixed(2);  // "99.00"
    const itemName =
      plan === "plus"
        ? "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"
        : "Ghosthome Street Access - 2 cams / 1 account - Monthly";

    // Build fields for recurring subscription (billing = monthly OR annual)
    // PayFast frequency: 3 = monthly, 6 = annually
    const frequency = billing === "annual" ? 6 : 3;
    const recurringAmount = amount; // same as amount
    const cycles = 0; // 0 = indefinite

    const fields = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: PAYFAST_RETURN_URL,
      cancel_url: PAYFAST_CANCEL_URL,
      notify_url: PAYFAST_NOTIFY_URL,

      amount: amount,
      item_name: itemName,
      item_description:
        "Community live-view access with night notifications (customisable hours).",

      // Keep only custom_str2 and custom_str3 (we intentionally omit empty custom_str1)
      custom_str2: plan,
      custom_str3: billing,

      // Recurring
      subscription_type: 1,
      recurring_amount: recurringAmount,
      frequency,
      cycles,
    };

    const { base, signature } = buildSignature(fields, PAYFAST_PASSPHRASE);
    const endpoint = chosenEndpoint(PAYFAST_MODE);

    const redirect =
      endpoint +
      "?" +
      Object.keys(fields)
        .sort()
        .map(
          (k) => `${k}=${encodeURIComponent(fields[k]).replace(/%20/g, "+")}`
        )
        .join("&") +
      `&signature=${signature}`;

    // If the UI asked for diagnostics, include the detail – still 200 OK
    const wantDiag = String(body.diagnostics || "") === "true";
    if (wantDiag) {
      return res.status(200).json({
        ok: true,
        redirect,
        debug: {
          signature_base: base,
          signature,
          mode: PAYFAST_MODE,
          fields,
        },
      });
    }

    // Normal success response
    return res.status(200).json({ ok: true, redirect });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: err?.message || "Internal error" });
  }
};
