// /api/payfast-itn.js
// Minimal ITN receiver — always reply 200 so PF doesn't keep retrying.
// You can add full signature verification and DB updates later.

export default async function handler(req, res) {
  try {
    // PF will POST x-www-form-urlencoded
    const raw = await new Promise((resolve, reject) => {
      let buf = "";
      req.on("data", (c) => (buf += c));
      req.on("end", () => resolve(buf));
      req.on("error", reject);
    });

    // Quick parse
    const params = {};
    for (const pair of raw.split("&")) {
      const [k, v] = pair.split("=");
      if (!k) continue;
      params[decodeURIComponent(k)] = decodeURIComponent(v || "");
    }

    console.log("PayFast ITN:", params);

    // TODO: verify signature here if you want, then persist status
    // Always respond 200 quickly
    res.status(200).send("OK");
  } catch (e) {
    console.error("ITN error:", e);
    res.status(200).send("OK"); // still OK to prevent PF retry storms in sandbox
  }
}
