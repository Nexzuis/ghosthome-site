// /api/payfast-itn.js
import crypto from "crypto";

/**
 * Minimal ITN endpoint for sandbox: verifies signature & responds 200.
 * You can extend to write into your DB after verification.
 */
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    // Collect raw form body (Vercel already parses to req.body as object)
    const payload = req.body || {};

    // Build signature base (exclude signature, include only non-empty)
    const phpUrlEncode = (val) =>
      encodeURIComponent(String(val))
        .replace(/%20/g, "+")
        .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

    const passphrase = process.env.PAYFAST_PASSPHRASE || "";

    const baseString = Object.keys(payload)
      .filter((k) => k !== "signature" && payload[k] !== "" && payload[k] !== null && payload[k] !== undefined)
      .sort()
      .map((k) => `${k}=${phpUrlEncode(payload[k])}`)
      .join("&");

    const computed = crypto
      .createHash("md5")
      .update(baseString + `&passphrase=${phpUrlEncode(passphrase)}`)
      .digest("hex");

    // Basic verify
    if (String(computed) !== String(payload.signature || "")) {
      console.warn("ITN signature mismatch");
      return res.status(200).send("INVALID"); // PayFast expects 200 always
    }

    // TODO: verify source IPs and /validate callback (optional in sandbox)
    // TODO: upsert subscription/customer status into your DB here

    return res.status(200).send("OK");
  } catch (e) {
    console.error("ITN error:", e);
    return res.status(200).send("ERROR"); // still 200
  }
}
