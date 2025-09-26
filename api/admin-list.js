const { Client } = require("pg");
const crypto = require("crypto");

function token32() {
  return crypto.randomBytes(16).toString("hex");
}

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
      kind text not null,
      filename text,
      mimetype text,
      size integer,
      content bytea,
      created_at timestamptz not null default now()
    );
  `);
}

module.exports = async (req, res) => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
  const pw = (req.query && req.query.pw) || "";

  if (!ADMIN_PASSWORD || pw !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: "Unauthorised" });
  }

  const url = process.env.POSTGRES_URL;
  if (!url) return res.status(500).json({ ok: false, error: "Database not configured" });

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await ensureTables(client);

    // Ensure paid users have an upload token
    const need = await client.query(`select id from signups where status='paid' and (upload_token is null or upload_token='')`);
    for (const r of need.rows) {
      await client.query(`update signups set upload_token=$1 where id=$2`, [token32(), r.id]);
    }

    // Return list + doc counts
    const rs = await client.query(`
      select s.id, s.full_name, s.email, s.phone, s.plan, s.billing, s.price, s.status,
             s.upload_token,
             coalesce((select count(*) from documents d where d.signup_id=s.id and d.kind='id'),0) as id_docs,
             coalesce((select count(*) from documents d where d.signup_id=s.id and d.kind='poa'),0) as poa_docs,
             s.created_at
      from signups s
      order by s.created_at desc
    `);

    return res.status(200).json({ ok: true, rows: rs.rows });
  } catch (e) {
    console.error("admin-list error", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  } finally {
    try { await client.end(); } catch {}
  }
};
