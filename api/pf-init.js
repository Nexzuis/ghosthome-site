// api/payfast-itn.js (CommonJS)
const crypto = require("crypto");

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
function buildBase(params, passphrase) {
  const q = Object.entries(params)
    .filter(([k, v]) => k !== "signature" && v !== undefined && v !== null && String(v).length > 0)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${urlencodePhp(k)}=${urlencodePhp(v)}`)
    .join("&");
  return q + (passphrase ? `&passphrase=${urlencodePhp(passphrase)}` : "");
}

module.exports = async (req, res) => {
  try {
    let raw = "";
    await new Promise((resolve, reject) => {
      req.on("data", (c) => (raw += c));
      req.on("end", resolve);
      req.on("error", reject);
    });

    const params = parseForm(raw);
    const postedSig = String(params.signature || "");
    const base = buildBase(params, process.env.PAYFAST_PASSPHRASE || "");
    const calc = md5Hex(base);

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
};
