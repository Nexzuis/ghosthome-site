// Returns latest signups (simple admin list) — protected by shared password
const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!auth || auth !== (process.env.ADMIN_PASSWORD || 'changeme')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { rows } = await sql`
      SELECT id, created_at, status, plan, billing, full_name, email, upload_token, verification_status
      FROM signups
      ORDER BY created_at DESC
      LIMIT 200;
    `;
    return res.status(200).json({ rows });
  } catch (e) {
    console.error('admin-list error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
