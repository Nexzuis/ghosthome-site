module.exports = async (req, res) => {
  return res.status(200).json({
    ok: true,
    env: process.env.VERCEL_ENV || "unknown",
    now: new Date().toISOString()
  });
};
