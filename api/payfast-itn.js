// Validates PayFast ITN signature and marks the signup paid.
// Also stores a minimal payments ledger for audit.
//
// ENV: POSTGRES_URL, PAYFAST_PASSPHRASE
//
// NOTE: For production hardening, you can also verify the source IP against PayFast IP ranges.
// This version focuses on signature validation and DB updates.

const { Client } = require("pg");
const crypto = require("crypto");
const querystring = require("querystring");

function encodeRFC3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}
function buildSignature(fields, passphrase) {
  const keys = Object.keys(fields).filter(k => k !== "signature" && k !== "pf_signature").sort();
  const query = keys.map(k => `${k}=${encodeRFC3986(String(fields[k] ?? ""))}`).join("&");
  const withPass = passphrase ? `${query}&passphrase=${encodeRFC3986(passphrase)}` : query;
  return crypto.createHash("md5").update(withPass).digest("hex");
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
    create table if not exists payments (
      id uuid primary key default uuid_generate_v4(),
      signup_id uuid references signups(id) on delete set null,
      m_payment_id text,
      pf_payment_id text,
      amount_gross numeric,
      payment_status text,
      raw_itn jsonb,
      created_at timestamptz not null default now()
    );
  `);
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).send("Not allowed");

    // Read raw body to parse x-www-form-urlencoded
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8") || "";
    const data = querystring.parse(raw);

    // Validate signature
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const theirSig = data.signature || data.pf_signature || "";
    const mineSig = buildSignature(data, passphrase);

    if (!theirSig || theirSig.toLowerCase() !== mineSig.toLowerCase()) {
      console.warn("ITN signature mismatch", { theirSig, mineSig });
      return res.status(400).send("Bad signature");
    }

    // Pull out fields we care about
    const payment_status = String(data.payment_status || "").toLowerCase(); // "complete", "failed", etc.
    const amount_gross = Number(data.amount_gross || data.amount || 0) || 0;
    const pf_payment_id = data.pf_payment_id || null;
    const m_payment_id = data.m_payment_id || null;
    const custom_str1 = data.custom_str1 || null; // we used signupId here

    const url = process.env.POSTGRES_URL;
    if (!url) {
      console.error("POSTGRES_URL missing");
      return res.status(500).send("DB missing");
    }

    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    await client.connect();
    try {
      await ensureTables(client);

      // Resolve signup: prefer custom_str1, else try m_payment_id
      let signupId = null;
      if (custom_str1) {
        const q = await client.query(`select id from signups where id = $1`, [custom_str1]);
        if (q.rowCount) signupId = q.rows[0].id;
      }

      // Store payment row
      await client.query(
        `insert into payments (signup_id, m_payment_id, pf_payment_id, amount_gross, payment_status, raw_itn)
         values ($1,$2,$3,$4,$5,$6)`,
        [signupId, m_payment_id, pf_payment_id, amount_gross, payment_status, JSON.stringify(data)]
      );

      // Mark paid on success
      if (payment_status === "complete" && signupId) {
        await client.query(`update signups set status='paid' where id=$1`, [signupId]);
      }

      // Respond 200 so PayFast stops retrying
      return res.status(200).send("OK");
    } finally {
      try { await client.end(); } catch {}
    }
  } catch (e) {
    console.error("payfast-itn error", e);
    // Return 200 to avoid infinite retries while you debug, change to 500 later if you want failures to retry.
    return res.status(200).send("OK");
  }
};
