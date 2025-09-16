const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const { token, kind, filename, contentType } = body;
    if (!token || !kind || !filename) return res.status(400).json({ error: 'Missing fields' });

    const { rows } = await sql`
      SELECT id FROM signups
      WHERE upload_token=${token} AND upload_token_expires_at > NOW() AND status='paid'
      LIMIT 1;
    `;
    if (rows.length === 0) return res.status(403).json({ error: 'Invalid or expired token' });

    const { generateUploadUrl } = await import('@vercel/blob');
    const { url, pathname } = await generateUploadUrl({
      contentType: contentType || 'application/octet-stream',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ uploadUrl: url, blobUrl: pathname });
  } catch (e) {
    console.error('upload-url error', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
