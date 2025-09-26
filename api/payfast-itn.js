// /api/payfast-itn.js
// Verifies PayFast ITN and records subscription status

import crypto from "crypto";

function pfEncode(v) {
  return encodeURIComponent(String(v)).replace(/%20/g, "%20");
}

function buildSignatureBase(fields, passphrase) {
  // remove signature and empties first
  const filtered = Object.fromEntries(
    Object.entries(fields).filter(
      ([k, v]) => k !== "signature" && v !== undefined && v !== null && v !== ""
    )
  );
  const sorted = Object.keys(filtered)
    .sort()
    .reduce((acc, k) => ((acc[k] = filtered[k]), acc), {});
  let base = Object.entries(sorted)
    .map(([k, v]) => `${k}=${pfEncode(v)}`)
    .join("&");
  if (passphrase && String(passphrase).length > 0) {
    base += `&passphrase=${pfEncode(passphrase)}`;
  }
  return base;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    // PayFast posts x-www-form-urlencoded
    const bodyText = await new Promise((resolve, reject) => {
      let buf = "";
      req.on("data", (c) => (buf += c));
      req.on("end", () => resolve(buf));
      req.on("error", reject);
    });

    // Parse into object
    const params = {};
    bodyText.split("&").forEach((pair) => {
      const [k, v] = pair.split("=");
      params[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });

    // Verify signature
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const base = buildSignatureBase(params, passphrase);
    const expectedSig = crypto.createHash("md5").update(base).digest("hex");
    const gotSig = params.signature || "";

    const valid = expectedSig === gotSig;

    // TODO: here you’d insert/update your DB with the subscription/payment status
    // params.payment_status == 'COMPLETE' etc.

    // Always 200 to PayFast; you can log invalids
    if (!valid) {
      console.warn("Invalid ITN signature", { expectedSig, gotSig, base, params });
    }

    return res.status(200).send("OK");
  } catch (e) {
    console.error(e);
    // PayFast still expects 200 OK (avoid retries storm); log the error.
    return res.status(200).send("OK");
  }
}
