// /api/signup.mjs  (ESM / Node on Vercel)
// Minimal sign-up API.
// If POSTGRES_URL is set, writes to Postgres and returns { ok:true, id }.
// If not, still returns { ok:true } so the UI can proceed.

import pg from "pg";
const { Client } = pg;
import { readBody } from "./lib/helpers.mjs";

async function ensureTables(client) {
  // Prefer pgcrypto's gen_random_uuid(); fall back to uuid-ossp if needed.
  try {
    await client.query(`create extension if not exists pgcrypto;`);
    await client.query(`
      create table if not exists signups (
        id uuid primary key default gen_random_uuid(),
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
        pf_payment_id text,
        pf_payment_status text,
        pf_itn_check boolean default false,
        created_at timestamptz not null default now()
      );
    `);
  } catch (e) {
    if (String(e?.message || "").toLowerCase().includes("gen_random_uuid")) {
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
          pf_payment_id text,
          pf_payment_status text,
          pf_itn_check boolean default false,
          created_at timestamptz not null default now()
        );
      `);
    } else {
      throw e;
    }
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const body = await readBody(req);
    const {
      plan, billing, price,
      fullName, email, phone,
      address1, suburb, city, postalCode
    } = body || {};

    // Basic validation
    if (!plan || !billing || !price || !fullName || !email || !phone) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const url = process.env.POSTGRES_URL;
    if (!url) {
      // No DB configured — still return ok so the UI can proceed.
      return res.status(200).json({ ok: true, id: null, mode: "no-db" });
    }

    const client = new Client({
      connectionString: url,
      // Many hosted Postgres require TLS; set to true/false as needed.
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      await ensureTables(client);

      const q = `
        insert into signups
          (plan, billing, price, full_name, email, phone, address1, suburb, city, postal_code)
        values
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        returning id
      `;
      const values = [
        String(plan), String(billing), Number(price),
        String(fullName), String(email), String(phone),
        address1 || null, suburb || null, city || null, postalCode || null
      ];

      const { rows } = await client.query(q, values);
      return res.status(200).json({ ok: true, id: rows?.[0]?.id || null });
    } catch (e) {
      console.error("signup error", e);
      return res.status(200).json({ ok: true, id: null, mode: "db-error" });
    } finally {
      try { await client.end(); } catch {}
    }
  } catch (e) {
    console.error("signup outer error", e);
    return res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
}
