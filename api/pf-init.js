// /api/payfast-itn.js
// Minimal ITN receiver. Logs and 200s quickly so PayFast doesn't retry.
// Optional: signature verification included (recommended even in sandbox).

import crypto from "crypto";

function urlencodePhp(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}
function md5Hex(str) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}
function parseForm(body) {
  const params = {};
  for (const pair of body.split("&")) {
    if (!pair) continue;
    const [k, v = ""] = pair.split("=");
    params[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, " "));
  }
  return params;
}
function buildQuery(params) {
  return Object.entries(params)
    .filter(([k, v]) => k !== "signature" && v !== undefined && v !== null && String(v).length > 0)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${urlencodePhp(k)}=${urlencodePhp(v)}`)
    .join("&");
}

export default async function handler(req, res) {
  try {
    // Raw body (x-www-form-urlencoded)
    const raw = await new Promise((resolve, reject) => {
      let buf = "";
      req.on("data", (c) => (buf += c));
      req.on("end", () => resolve(buf));
      req.on("error", reject);
    });

    const params = parseForm(raw);
    const postedSig = String(params.signature || "");
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";

    const base = buildQuery(params) + (passphrase ? `&passphrase=${urlencodePhp(passphrase)}` : "");
    const calcSig = md5Hex(base);

    const sigOk = postedSig.toLowerCase() === calcSig.toLowerCase();

    console.log("PayFast ITN:", {
      m_payment_id: params.m_payment_id,
      pf_payment_id: params.pf_payment_id,
      payment_status: params.payment_status,
      sigOk
    });

    // TODO: if sigOk && payment_status === 'COMPLETE' => update order in DB

    // Always reply 200 quickly to stop retries
    res.status(200).send("OK");
  } catch (e) {
    console.error("ITN error:", e);
    res.status(200).send("OK"); // still OK to prevent retry storms
  }
}
