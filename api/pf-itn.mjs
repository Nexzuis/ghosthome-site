// ITN verification — ESM version. Always 200 OK after computing signature.

import md5 from "md5";
import { readBody } from "./lib/helpers.mjs";
import { getDb, ensureLogTable } from "./lib/db.mjs";

function urlencodePhp(v) {
  return encodeURIComponent(String(v)).replace(/%20/g, "+");
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    await ensureLogTable(db);
    const body = await readBody(req);

    let log = await db.query({
      text: 'INSERT INTO notify_log (payload, body) VALUES ($1, $2)',
      values: [
        JSON.stringify({
          method: req.method,
          url: req.url,
          headers: req.headers,
        }),
        JSON.stringify(body)
      ]
    });

    const pass = (process.env.PAYFAST_PASSPHRASE || "").trim();
    const base =
      Object.entries(body)
        .filter(
          ([k, v]) =>
            k !== "signature" &&
            v !== undefined &&
            v !== null &&
            String(v).length > 0
        )
        .map(([k, v]) => `${urlencodePhp(k)}=${urlencodePhp(v)}`)
        .join("&") +
      (pass ? `&passphrase=${urlencodePhp(pass)}` : "");

    const posted = String(body.signature || "").trim().toLowerCase();
    const signupId = String(body.m_payment_id || "").trim().toLowerCase();
    const paymentId = String(body.pf_payment_id || body.m_payment_id || "").trim().toLowerCase();
    const paymentStatus = String(body.payment_status || "").trim().toLowerCase();
    const calc = md5(base).toLowerCase();
    const ok = posted === calc;

    log = await db.query({
      text:
        `UPDATE signups
        SET pf_payment_id = $1,
          pf_payment_status = $2,
          pf_itn_check = $3
        WHERE id = $4`,
      values: [
        paymentId, paymentStatus, ok, signupId
      ]
    });

    req.on("error", () => res.status(200).send("OK"));
  } catch {
    res.status(200).send("OK");
  }

  res.status(200).send("OK");
}
