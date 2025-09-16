// Sets status or verification_status — protected by shared password
const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!auth || auth !== (process.env.ADMIN_PASSWORD || 'changeme')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { signup_id, field, value } = req.body || {};
    if (!signup_id || !field) return res.status(400).json({ error: 'Missing fields' });

    if (field === 'status') {
      await sql`UPDATE signups SET status=${value} WHERE id=${signup_id};`;
    } else if (field === 'verification_status') {
      await sql`UPDATE signups SET verification_status=${value} WHERE id=${signup_id};`;
    } else {
      return res.status(400).json({ error: 'Bad field' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('admin-set-status error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
