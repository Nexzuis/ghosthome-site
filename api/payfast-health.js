// api/payfast-health.js (CommonJS) — sanity test the runtime
module.exports = (req, res) => {
  res.status(200).json({ ok: true, runtime: "CommonJS", node: process.version });
};
