// api/payfast-itn.js
import crypto from "crypto";

function pfEncode(value) {
  return encodeURIComponent(String(value))
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function buildSignatureString(fields, passphrase) {
  const keys = Object.keys(fields).filter((k) => fields[k] !== undefined && fields[k] !== null).sort();
  const pairs = keys.map((k) => `${k}=${pfEncode(fields[k])}`);
  if (passphrase && String(passphrase).length > 0) {
    pairs.push(`passphrase=${pfEncode(passphrase)}`);
  }
  return pairs.join("&");
}

function md5(str) {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Vercel parses URL-encoded bodies for Node functions only if content-type is correct.
    // We handle both JSON and urlencoded just in case.
    let incoming = {};
    if (req.headers["content-type"]?.includes("application/json")) {
      incoming = req.body || {};
    } else {
      // Collect raw body
      const raw = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (c) => (data += c));
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      incoming = Object.fromEntries(new URLSearchParams(raw));
    }

    // Extract and re-create signature
    const postedSig = incoming.signature || incoming["signature"] || "";
    const { signature, ...withoutSig } = incoming;

    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const base = buildSignatureString(withoutSig, passphrase);
    const calc = md5(base);

    const verified = postedSig === calc;

    // TODO: here you would persist the payment/subscription status to your DB
    console.log("PAYFAST ITN ▸ verified:", verified, {
      postedSig,
      calc,
      event: incoming.payment_status || "n/a",
      name: incoming.item_name,
      meta: {
        custom_str2: incoming.custom_str2,
        custom_str3: incoming.custom_str3,
      },
    });

    // Always respond 200 to acknowledge receipt (PayFast requires it)
    res.status(200).send("OK");
  } catch (e) {
    console.error("ITN error:", e);
    res.status(200).send("OK");
  }
}
