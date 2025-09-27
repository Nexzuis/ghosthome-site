/* eslint-disable */
// /api/pf-init.js — TEMP: prove the route exists and accepts GET+POST
module.exports = (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }
    res.status(200).json({
      ok: true,
      route: "pf-init",
      method: req.method,
      envSeen: !!process.env.PAYFAST_MERCHANT_ID
    });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
};
