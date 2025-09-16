// PayFast ITN: verify signature + amount, then mark signup as paid and create upload token
const { sql } = require('@vercel/postgres');
const crypto = require('crypto');
const querystring = require('querystring');

const PRICES = {
  '2c': { monthly: 99.00, annual: 1099.00 },
  '4c': { monthly: 149.00, annual: 1299.00 },
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return; }
  try {
    const raw = await readBody(req);
    const params = querystring.parse(raw); // form-encoded

    // verify signature
    const passphrase = process.env.PAYFAST_PASSPHRASE || '';
    const sorted = Object.keys(params).filter(k => k !== 'signature').sort().reduce((acc, k) => (acc[k]=params[k], acc), {});
    let qs = querystring.stringify(sorted);
    if (passphrase) qs += `&passphrase=${encodeURIComponent(passphrase)}`;
    const computed = crypto.createHash('md5').update(qs).digest('hex');
    if ((params.signature || '').toLowerCase() !== computed.toLowerCase()) {
      console.warn('ITN signature mismatch');
      res.status(400).send('Bad signature'); return;
    }

    const signup_id = params.custom_str1;
    const amount_gross = parseFloat(params.amount_gross || '0');

    // fetch signup and expected amount
    const { rows } = await sql`SELECT id, plan, billing FROM signups WHERE id=${signup_id} LIMIT 1;`;
    if (rows.length === 0) { res.status(404).send('No signup'); return; }

    const expected = (PRICES[rows[0].plan] && PRICES[rows[0].plan][rows[0].billing]) || 0;
    if (Math.abs(amount_gross - expected) > 0.01) {
      console.warn('ITN amount mismatch', amount_gross, expected);
      res.status(400).send('Bad amount'); return;
    }

    // mark paid + create upload token valid for 7 days
    const token = crypto.randomBytes(24).toString('hex');
    await sql`
      UPDATE signups
      SET status='paid',
          upload_token=${token},
          upload_token_expires_at=NOW() + INTERVAL '7 days'
      WHERE id=${signup_id};
    `;

    res.status(200).send('OK');
  } catch (e) {
    console.error('ITN error', e);
    res.status(500).send('Server error');
  }
};
