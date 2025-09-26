// ESM — quick env check (no secrets leaked)
export default async function handler(req, res) {
  const present = v => (v && String(v).trim().length > 0);
  const mode = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();

  const checks = {
    PAYFAST_MODE: mode,
    PAYFAST_MERCHANT_ID: present(process.env.PAYFAST_MERCHANT_ID),
    PAYFAST_MERCHANT_KEY: present(process.env.PAYFAST_MERCHANT_KEY),
    PAYFAST_PASSPHRASE: present(process.env.PAYFAST_PASSPHRASE),
    PAYFAST_RETURN_URL: present(process.env.PAYFAST_RETURN_URL),
    PAYFAST_CANCEL_URL: present(process.env.PAYFAST_CANCEL_URL),
    PAYFAST_NOTIFY_URL: present(process.env.PAYFAST_NOTIFY_URL),
  };

  return res.status(200).json({
    ok: true,
    checks,
    hint: "All must be true (except MODE which just shows 'sandbox' or 'live'). If any are false, set them in Vercel → Settings → Environment Variables and redeploy."
  });
}
