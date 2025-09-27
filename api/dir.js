// /api/dir.js — lists what Vercel actually packed into /api
const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  try {
    const dir = path.join(__dirname);
    const files = fs.readdirSync(dir).sort();
    res.status(200).json({ ok: true, apiDir: dir, files });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
};
