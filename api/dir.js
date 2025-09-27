/* eslint-disable */
// /api/dir.js — lists what Vercel actually packed into /api
const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  try {
    const files = fs.readdirSync(__dirname).sort();
    res.status(200).json({ ok: true, files });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
};
