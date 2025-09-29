// /api/pf-init.mjs
// PayFast initiate (subscriptions) — MINIMAL + STRICT + DEBUG
// Signature rules (this build): alpha-sort, RAW urlencoding (spaces => %20), append &passphrase, MD5 hex.

import { getDb } from "./lib/db.mjs";
import md5 from "md5";

function urlencodePhp(v) {
  // RAW urlencoding (like PHP rawurlencode): spaces -> %20 -> +
  return encodeURIComponent(String(v)).replace(/%20/g, "+");
}

function buildSignature(fields, passphrase) {
  const base =
    Object.keys(fields)
      .filter(k => fields[k] !== undefined && fields[k] !== null && String(fields[k]).length > 0)
      .map(k => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`)
      .join("&") + `&passphrase=${urlencodePhp(passphrase)}`;
  const sig = md5(base).toLowerCase();
  return { base, sig };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST" && req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const signupId = req.query?.signupId || null;
    const db = await getDb();
    let signup = await db.query({
      text: 'SELECT * FROM signups WHERE id = $1',
      values: [signupId]
    });

    if (signup.rowCount !== 1) {
      return res.status(400).json({ ok: false, error: "signupId not found" });
    }
    signup = signup.rows[0]

    const engine = (process.env.PAYFAST_ENGINE || "").trim();
    const MERCHANT_ID  = (process.env.PAYFAST_MERCHANT_ID  || "").trim();
    const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const PASSPHRASE   = (process.env.PAYFAST_PASSPHRASE   || "").trim();
    const RETURN_URL   = (process.env.PAYFAST_RETURN_URL   || "").trim();
    const CANCEL_URL   = (process.env.PAYFAST_CANCEL_URL   || "").trim();
    const NOTIFY_URL   = (process.env.PAYFAST_NOTIFY_URL   || "").trim();
    const FREQUENCY = { monthly: 3, annual: 6 };

    if (!MERCHANT_ID || !MERCHANT_KEY || !PASSPHRASE || !engine) {
      return res.status(200).json({ ok: false, error: "Missing config envs" });
    }

    // Minimal required subscription fields (ALL strings)
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      m_payment_id: signupId,
      amount: signup.price,
      item_name: `Ghosthome ${signup.plan} ${signup.billing}`,
      subscription_type: "1",
      recurring_amount: signup.price,
      frequency: FREQUENCY[signup.billing],
      cycles: "0", // indefinite
    };

    const { base, sig } = buildSignature(fields, PASSPHRASE);

    const response = { ok: true, engine, fields: { ...fields, signature: sig } };
    if (req.method === "GET") {
      response.debug_signature_base = base;
      response.debug_signature_md5 = sig;
    }
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({ ok: false, error: `pf-init error: ${String(e?.message || e)}` });
  }
}
