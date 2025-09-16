// Records uploaded document metadata and flags signup for review
const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const { token, kind, blob_url, filename, size_bytes = 0 } = body;
    if (!token || !kind || !blob_url || !filename) return res.status(400).json({ error: 'Missing fields' });

    const { rows } = await sql`
      SELECT id FROM signups
      WHERE upload_token=${token} AND upload_token_expires_at > NOW()
      LIMIT 1;
    `;
    if (rows.length === 0) return res.status(403).json({ error: 'Invalid or expired token' });
    const signup_id = rows[0].id;

    await sql`
      INSERT INTO documents (signup_id, kind, blob_url, filename, size_bytes, uploaded_at)
      VALUES (${signup_id}, ${kind}, ${blob_url}, ${filename}, ${size_bytes}, NOW());
    `;

    await sql`UPDATE signups SET verification_status='pending_review' WHERE id=${signup_id};`;

    await sql`
      INSERT INTO audit_log (signup_id, actor, event, meta, created_at)
      VALUES (${signup_id}, 'user', 'document_uploaded', ${JSON.stringify({ kind, filename })}, NOW());
    `;

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('attach-document error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
