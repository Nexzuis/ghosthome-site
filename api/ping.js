// ESM — simple health check
export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    env: {
      NODE_ENV: process.env.NODE_ENV || null,
      PAYFAST_MODE: process.env.PAYFAST_MODE || null
    },
    message: "API is alive"
  });
}
