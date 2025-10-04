// api/cancel.mjs

import md5 from "md5";
import fetch from "node-fetch";
import { getDb } from "./lib/db.mjs";
import { readBody } from "./lib/helpers.mjs";

function urlencodePhp(v) {
  // RAW urlencoding (like PHP rawurlencode): spaces -> %20 -> +
  return encodeURIComponent(String(v)).replace(/%20/g, "+");
}

function buildSignature(fields, passphrase) {
  fields.passphrase = passphrase;
  const base =
    Object.keys(fields)
      .filter(
        (k) =>
          fields[k] !== undefined &&
          fields[k] !== null &&
          String(fields[k]).length > 0
      )
      .sort()
      .map((k) => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`)
      .join("&");

  const sig = md5(base).toLowerCase();
  return { base, sig };
}

function formatDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());

  // timezone offset in minutes
  const tz = -d.getTimezoneOffset(); // JS gives minutes *behind* UTC
  const sign = tz >= 0 ? "+" : "-";
  const abs = Math.abs(tz);
  const tzHour = pad(Math.floor(abs / 60));
  const tzMin = pad(abs % 60);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${tzHour}${tzMin}`;
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const body = await readBody(req);

    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const signupId = body?.signupId;
    if (!signupId) {
      return res.status(400).json({ ok: false, error: "Missing signupId" });
    }

    const q = await db.query({
      text: `
        SELECT s.id, s.pf_token, l.n_token,
          coalesce(s.pf_token, l.n_token) AS cancel_token
        FROM signups s
        LEFT JOIN (
          SELECT
            (body::json->>'m_payment_id') AS id,
            (body::json->>'token') AS n_token
          FROM notify_log
        ) l ON s.id::text = l.id
        WHERE s.id = $1
        ORDER BY s.pf_itn_check DESC
        LIMIT 1
      `,
      values: [signupId],
    });

    if (q.rows.length === 0) {
      return res.status(400).json({ ok: false, error: "Subscription not found" });
    }

    const { cancel_token: cancelToken } = q.rows[0];
    if (!cancelToken) {
      return res.status(400).json({ ok: false, error: "No cancel token available" });
    }

    const PAYFAST_API_BASE = process.env.PAYFAST_API_BASE || "https://api.payfast.co.za";
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const version = process.env.PAYFAST_API_VERSION || "v1";
    const timestamp = formatDate();
    const isTest = (process.env.IS_DEV || 'false') == 'true';
    const url = `${PAYFAST_API_BASE}/subscriptions/${encodeURIComponent(cancelToken)}/cancel`+(isTest ? '?testing=true' : '');

    let headers = {
      "merchant-id": merchantId,
      "version": version,
      "timestamp": timestamp,
    };

    const { base, sig } = buildSignature(headers, passphrase);
    headers.signature = sig;

    const cancelRes = await fetch(url, {
      method: "PUT",
      headers: headers,
    });

    if (!cancelRes.ok) {
      const errText = await cancelRes.text().catch(() => "");
      console.error("PayFast cancel error:", cancelRes.status, errText);
      return res.status(500).json({ ok: false, error: `PayFast cancel failed (${cancelRes.status})` });
    }

    const cancelJson = await cancelRes.json().catch(() => null);
    console.log(cancelJson);
    if (cancelJson.status == 'failed') {
      return res.status(500).json({ ok: false, error: `PayFast cancel failed (${cancelJson?.data?.message})` });
    }

    // Optionally, you may want to mark your DB record as canceled
    await db.query({
      text: `
        UPDATE signups
        SET status = 'canceled', canceled_at = now()
        WHERE id = $1
      `,
      values: [signupId],
    });

    return res.json({ ok: true, result: cancelJson });
  } catch (err) {
    console.error("Cancel API error", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
