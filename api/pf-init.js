import crypto from "node:crypto";

/** Encode exactly like application/x-www-form-urlencoded (spaces -> "+") */
function encodeForm(str) {
  return encodeURIComponent(str)
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, (c) =>
      `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

/** Normalise punctuation and strip non-ASCII so PayFast and we hash the same bytes */
function sanitizePF(text) {
  if (text == null) return "";
  let t = String(text);
  t = t
    .replace(/[–—−]/g, "-")
    .replace(/[“”„‟]/g, '"')
    .replace(/[’‘‚‛]/g, "'")
    .replace(/…/g, "...");
  t = t.normalize("NFKD").replace(/[^\x20-\x7E]/g, "");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

/** Build the MD5 signature from the (alpha-sorted) fields. Exclude empty values. */
function buildSignatureAndBase(fields, passphrase) {
  // drop empty / undefined – PayFast ignores them when hashing
  const filtered = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && v !== "") filtered[k] = v;
  }

  const keys = Object.keys(filtered).sort();
  const base = keys.map((k) => `${k}=${encodeForm(String(filtered[k]))}`).join("&");
  const baseWithPass = passphrase
    ? `${base}&passphrase=${encodeForm(passphrase)}`
    : base;

  const signature = crypto.createHash("md5").update(baseWithPass).digest("hex");
  return { signature, base: baseWithPass, fields: filtered };
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
      plan = "basic",        // 'basic' (2 cams / 1 account) or 'standard' (4 cams / 2 accounts)
      billing = "monthly",   // 'monthly' or 'annual'
      amount = 0,            // 99 / 149 / 1099 / 1299 etc
      signupId = "",         // internal reference if you pass one
      name = "",             // optional buyer name
      email = "",            // optional buyer email
    } = req.body || {};

    const mode = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
    const merchant_id  = (process.env.PAYFAST_MERCHANT_ID || "").trim();
    const merchant_key = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const passphrase   = (process.env.PAYFAST_PASSPHRASE || "").trim();

    // derive defaults from request host if explicit envs aren’t set
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "").replace(/\/+$/, "");
    const baseUrl = host ? `https://${host}` : "";

    const return_url = (process.env.PAYFAST_RETURN_URL || (baseUrl ? `${baseUrl}/pay?result=success` : "")).trim();
    const cancel_url = (process.env.PAYFAST_CANCEL_URL || (baseUrl ? `${baseUrl}/pay?result=cancel` : "")).trim();
    const notify_url = (process.env.PAYFAST_NOTIFY_URL || (baseUrl ? `${baseUrl}/api/payfast-itn` : "")).trim();

    // quick diagnostics if something is missing
    const checks = {
      PAYFAST_MODE: mode,
      PAYFAST_MERCHANT_ID: !!merchant_id,
      PAYFAST_MERCHANT_KEY: !!merchant_key,
      PAYFAST_PASSPHRASE: passphrase !== undefined, // may be empty if disabled at PF
      PAYFAST_RETURN_URL: !!return_url,
      PAYFAST_CANCEL_URL: !!cancel_url,
      PAYFAST_NOTIFY_URL: !!notify_url,
    };

    const missing = [];
    if (!merchant_id)  missing.push("PAYFAST_MERCHANT_ID");
    if (!merchant_key) missing.push("PAYFAST_MERCHANT_KEY");
    if (!return_url)   missing.push("PAYFAST_RETURN_URL");
    if (!cancel_url)   missing.push("PAYFAST_CANCEL_URL");
    if (!notify_url)   missing.push("PAYFAST_NOTIFY_URL");

    if (missing.length) {
      return res.status(500).json({
        ok: false,
        error: "Missing PayFast configuration",
        missing,
        checks,
        hint: "All must be true (except MODE which just shows 'sandbox' or 'live'). Fix envs and redeploy.",
      });
    }

    const cents = (Number(amount) || 0).toFixed(2);
    if (Number(cents) <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid amount", checks });
    }

    // We’re using subscriptions for both monthly and annual packages.
    const isSubscription = true;
    // PayFast frequency: 3=monthly, 6=annually (per docs). We’ll use 3 for monthly, 6 for annual.
    const frequency = billing === "annual" ? 6 : 3;
    const cycles = 0; // 0 = indefinite

    const item_name =
      billing === "monthly"
        ? (plan === "standard"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Monthly"
            : "Ghosthome Street Access - 2 cams / 1 account - Monthly")
        : (plan === "standard"
            ? "Ghosthome Street Access - 4 cams / 2 accounts - Annual"
            : "Ghosthome Street Access - 2 cams / 1 account - Annual");

    const item_description = "Community live-view access with night notifications (customisable hours).";

    // Build field set (omit empty values completely)
    const fieldsRaw = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      amount: cents,
      item_name: sanitizePF(item_name),
      item_description: sanitizePF(item_description),

      // custom_*: only include non-empty values. We’ll filter empties out below as well.
      custom_str1: signupId || undefined,
      custom_str2: plan,
      custom_str3: billing,

      // Subscriptions
      subscription_type: isSubscription ? 1 : undefined,
      recurring_amount:  isSubscription ? cents : undefined,
      frequency:         isSubscription ? frequency : undefined,
      cycles:            isSubscription ? cycles : undefined,

      // Optional buyer details if you want to pass them
      email_address: email ? sanitizePF(email) : undefined,
      // split name into first/last (omit last if empty)
      ...(name
        ? (() => {
            const parts = String(name).trim().split(/\s+/);
            const first = sanitizePF(parts[0] || "");
            const last = sanitizePF(parts.slice(1).join(" "));
            return {
              name_first: first || undefined,
              name_last: last || undefined,
            };
          })()
        : {}),
    };

    const { signature, base: signature_base, fields } = buildSignatureAndBase(fieldsRaw, passphrase);
    fields.signature = signature;

    const payload = {
      ok: true,
      action: pfEndpoint(mode),
      fields,
    };

    // Sandbox helper: show exactly what we signed so you can compare with PayFast
    if (mode === "sandbox") {
      payload.debug_signature_base = signature_base;
    }

    return res.status(200).json(payload);
  } catch (err) {
    console.error("payfast-init fatal", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
