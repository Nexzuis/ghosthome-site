// Builds signed PayFast fields and returns { action, fields } for the browser to POST
const { sql } = require('@vercel/postgres');
const crypto = require('crypto');
const querystring = require('querystring');

const PRICES = {
  '2c': { monthly: 99.00, annual: 1099.00 },
  '4c': { monthly: 149.00, annual: 1299.00 },
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { signup_id, plan, billing } = req.body || {};
    if (!signup_id || !plan || !billing) return res.status(400).json({ error: 'Missing fields' });

    // confirm signup exists
    const { rows } = await sql`SELECT id, email, full_name FROM signups WHERE id=${signup_id} LIMIT 1;`;
    if (rows.length === 0) return res.status(404).json({ error: 'Signup not found' });

    const merchant_id = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE || '';
    const mode = (process.env.PAYFAST_MODE || 'sandbox').toLowerCase();
    const return_url = process.env.PAYFAST_RETURN_URL || 'https://example.com/pay/complete';
    const cancel_url = process.env.PAYFAST_CANCEL_URL || 'https://example.com/pay/cancel';
    const notify_url = process.env.PAYFAST_NOTIFY_URL || 'https://example.com/api/payfast-itn';

    const price = (PRICES[plan] && PRICES[plan][billing]) || null;
    if (!price) return res.status(400).json({ error: 'Invalid plan/billing' });

    const item_name = billing === 'annual'
      ? (plan === '2c' ? 'Street Access (2 cams) — 12 months' : 'Street Access (4 cams) — 12 months')
      : (plan === '2c' ? 'Street Access (2 cams) — monthly' : 'Street Access (4 cams) — monthly');

    const fields = {
      merchant_id,
      merchant_key,
      amount: price.toFixed(2),
      item_name,
      custom_str1: signup_id,
      return_url,
      cancel_url,
      notify_url,
      email_address: rows[0].email,
      name_first: rows[0].full_name.split(' ')[0] || rows[0].full_name,
      name_last: rows[0].full_name.split(' ').slice(1).join(' ') || rows[0].full_name,
    };

    // build signature: sorted query + optional passphrase
    const sorted = Object.keys(fields).sort().reduce((acc, k) => (acc[k]=fields[k], acc), {});
    let qs = querystring.stringify(sorted);
    if (passphrase) qs += `&passphrase=${encodeURIComponent(passphrase)}`;
    const signature = crypto.createHash('md5').update(qs).digest('hex');

    const action = mode === 'live' ? 'https://www.payfast.co.za/eng/process' : 'https://sandbox.payfast.co.za/eng/process';
    return res.status(200).json({ action, fields: { ...fields, signature } });
  } catch (e) {
    console.error('payfast-initiate error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
