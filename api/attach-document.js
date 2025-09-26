const { Client } = require("pg");

async function ensureTables(client) {
  await client.query(`create extension if not exists "uuid-ossp";`);
  await client.query(`
    create table if not exists signups (
      id uuid primary key default uuid_generate_v4(),
      plan text not null,
      billing text not null,
      price numeric not null,
      full_name text not null,
      email text not null,
      phone text not null,
      address1 text,
      suburb text,
      city text,
      postal_code text,
      status text not null default 'pending',
      upload_token text,
      created_at timestamptz not null default now()
    );
  `);
  await client.query(`
    create table if not exists documents (
      id uuid primary key default uuid_generate_v4(),
      signup_id uuid not null references signups(id) on delete cascade,
      kind text not null, -- 'id' or 'poa'
      filename text,
      mimetype text,
      size integer,
      content bytea,
      created_at timestamptz not null default now()
    );
  `);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

    const { token, type, filename, mimetype, size, base64 } = req.body || {};
    if (!token || !type || !base64) {
      return res.status(400).json({ ok: false, error: "Missing token/type/content" });
    }
    if (!["id", "poa"].includes(type)) {
      return res.status(400).json({ ok: false, error: "Invalid type" });
    }

    const url = process.env.POSTGRES_URL;
    if (!url) return res.status(500).json({ ok: false, error: "Database not configured" });

    const buf = Buffer.from(base64, "base64");
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    await client.connect();
    try {
      await ensureTables(client);

      // Resolve signup by token
      const s = await client.query(`select id from signups where upload_token=$1`, [token]);
      if (!s.rowCount) return res.status(404).json({ ok: false, error: "Invalid upload link" });
      const signupId = s.rows[0].id;

      // Keep latest per kind
      await client.query(`delete from documents where signup_id=$1 and kind=$2`, [signupId, type]);
      await client.query(
        `insert into documents (signup_id, kind, filename, mimetype, size, content)
         values ($1,$2,$3,$4,$5,$6)`,
        [signupId, type, filename || null, mimetype || null, size || null, buf]
      );

      return res.status(200).json({ ok: true });
    } finally {
      try { await client.end(); } catch {}
    }
  } catch (e) {
    console.error("attach-document error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
};
