export const config = { runtime: "nodejs20.x" };
export default function handler(req, res) {
  res.status(200).json({ ok: true, runtime: "nodejs20.x", node: process.version });
}
