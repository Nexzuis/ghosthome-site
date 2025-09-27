// api/payfast-initiate.js — Step A: no logic, just JSON
function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, stage: "A", note: "GET health" });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  return res.status(200).json({ ok: true, stage: "A", message: "POST received" });
}
module.exports = handler;
module.exports.config = { runtime: "nodejs" };
