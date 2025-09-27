/* eslint-disable */
module.exports = (req, res) => res.status(200).json({ ok: true, route: "ping", now: Date.now() });
