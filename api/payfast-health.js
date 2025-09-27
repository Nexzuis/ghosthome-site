// Quick runtime check
function handler(req, res) {
  res.status(200).json({ ok: true, runtime: "nodejs", node: process.version });
}
module.exports = handler;
module.exports.config = { runtime: "nodejs" };
