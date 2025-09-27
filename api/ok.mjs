// ESM diagnostic: should never crash
export default function handler(req, res) {
  res.status(200).json({ ok: true, route: "ok", method: req.method, ts: Date.now() });
}
