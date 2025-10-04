// api/upload.mjs
import { put } from "@vercel/blob";
import { getDb } from "./lib/db.mjs";
import { readBody } from "./lib/helpers.mjs";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const body = await readBody(req);

    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // ✅ Case 1: Lookup signupId by email/phone
    if (req.query.getSignupId === "true") {
      const { email, phone } = body || {};
      if (!email && !phone) {
        return res.status(400).json({ ok: false, error: "Email or phone required" });
      }

      const q = await db.query({
        text: `
            SELECT *
            FROM signups s
            WHERE regexp_replace(email, '\s', '', 'g') = regexp_replace($1::TEXT, '\s', '', 'g')
            OR RIGHT(regexp_replace(phone, '\s', '', 'g'), 9) = RIGHT(regexp_replace($2, '\s', '', 'g'), 9)
            ORDER BY COALESCE(s.pf_payment_id::int, 0) DESC LIMIT 1
        `,
        values: [email || null, phone || null],
      });

      if (q.rows.length === 0) {
        return res.json({ ok: false, error: "Signup not found" });
      }

      return res.json({ ok: true, signupId: q.rows[0].id });
    }

    // ✅ Case 2: File upload
    const { signupId, type, filename, mimetype, size, base64 } = body || {};
    if (!signupId || !type || !filename || !mimetype || !base64) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    // Decode base64 into a Buffer
    const buffer = Buffer.from(base64, "base64");

    // Upload to Vercel Blob — path includes signupId and type
    const blobName = `signup/${signupId}/${type}-${Date.now()}-${filename}`;
    const { url } = await put(blobName, buffer, {
      access: "public",
      contentType: mimetype,
    });

    // Store reference in DB
    await db.query({
      text: `
        INSERT INTO uploads (signup_id, kind, blob_url, filename, size_bytes, uploaded_at)
        VALUES ($1, $2, $3, $4, $5, now())
      `,
      values: [signupId, type, url, filename, size],
    });

    return res.json({ ok: true, url });
  } catch (err) {
    console.error("Upload API error", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
