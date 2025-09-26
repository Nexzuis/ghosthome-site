// api/payfast-itn.js
const crypto = require("crypto");

function safeVal(v) {
  return v === undefined || v === null ? "" : String(v);
}

function buildSignatureFromObject(obj, passphrase) {
  const filtered = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (k === "signature") continue;
    const sv = safeVal(v);
    if (sv !== "") filtered[k] = sv;
  }
  const pairs = Object.keys(filtered)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(filtered[k]).replace(/%20/g, "+")}`);

  if (passphrase) {
    pairs.push(
      `passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    );
  }

  const base = pairs.join("&");
  const signature = crypto.createHash("md5").update(base).digest("hex");
  return { base, signature };
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const posted =
      req.body && typeof req.body === "object"
        ? req.body
        : JSON.parse(req.body || "{}");

    const { PAYFAST_PASSPHRASE, PAYFAST_MERCHANT_ID } = process.env;

    // 1) signature check
    const postedSig = String(posted.signature || "");
    const { signature } = buildSignatureFromObject(posted, PAYFAST_PASSPHRASE);

    // 2) merchant sanity
    const merchantOk =
      String(posted.merchant_id || "") === String(PAYFAST_MERCHANT_ID || "");

    const sigOk = postedSig && postedSig === signature;

    // TODO: optional server-side validation call to PayFast /eng/query/validate
    // Skipped here; we just acknowledge if sig & merchant look fine.

    if (sigOk && merchantOk) {
      // You could update DB here (mark subscription pending/active)
      return res.status(200).send("OK");
    }

    return res.status(400).send("BAD");
  } catch (e) {
    return res.status(500).send("ERROR");
  }
};
