// api/payfast-itn.js (CommonJS + node runtime)
const crypto = require("crypto");

function urlencodePhp(v) { return encodeURIComponent(String(v)).replace(/%20/g, "+"); }
function md5Hex(s) { return crypto.createHash("md5").update(s, "utf8").digest("hex"); }
function parseForm(body) {
  const out = {};
  for (const pair of body.split("&")) {
    if (!pair) continue;
    const [k, v = ""] = pair.split("=");
    out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, " "));
  }
  return out;
}
function buildBase(params, passphrase) {
  const q = Object.entries(params)
    .filter(([k, v]) => k !== "signature" && v !== undefined && v !== null && String(v).length > 0)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${urlencodePhp(k)}=${urlencodePhp(v)}`)
    .join("&");
  return q + (passphrase ? `&passphrase=${urlencodePhp(passphrase)}` : "");
}

async function handler(req, res) {
  try {
    let raw = "";
    await new Promise((resolve, reject) => {
      req.on("data", c => (raw += c));
      req.on("end", resolve);
      req.on("error", reject);
    });

    const params = parseForm(raw);
    const postedSig = String(params.signature || "");
    const calc = md5Hex(buildBase(params, process.env.PAYFAST_PASSPHRASE || ""));

    console.log("ITN", {
      m_payment_id: params.m_payment_id,
      pf_payment_id: params.pf_payment_id,
      status: params.payment_status,
      sigOk: postedSig.toLowerCase() === calc.toLowerCase(),
    });

    res.status(200).send("OK");
  } catch (e) {
    console.error("ITN error", e);
    res.status(200).send("OK");
  }
}

module.exports = handler;
module.exports.config = { runtime: "nodejs" };
