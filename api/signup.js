// Node.js Vercel Function — creates a signup row (pending_payment)
const { sql } = require('@vercel/postgres');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const { plan, billing, full_name, email, phone, address, nearest = '', second_user_email = '' } = body;

    if (!plan || !billing || !full_name || !email || !phone || !address) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const id = crypto.randomUUID();
    const { rows } = await sql`
      INSERT INTO signups (id, created_at, status, plan, billing, full_name, email, phone, address, nearest, second_user_email, verification_status)
      VALUES (${id}, NOW(), 'pending_payment', ${plan}, ${billing}, ${full_name}, ${email}, ${phone}, ${address}, ${nearest}, ${second_user_email}, 'none')
      RETURNING id;
    `;

    return res.status(200).json({ signup_id: rows[0].id });
  } catch (e) {
    console.error('signup error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
