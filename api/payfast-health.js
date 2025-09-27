// api/payfast-initiate.js (EDGE RUNTIME)
// Returns PayFast fields for a real HTML form POST.
// No Node 'crypto', uses pure-JS MD5; no CommonJS/ESM issues.

export const config = { runtime: "edge" };

// Tiny, dependency-free MD5 (ASCII-safe)
function md5(input) {
  function rhex(n) {
    const s = "0123456789abcdef";
    let j, out = "";
    for (j = 0; j < 4; j++) out += s.charAt((n >> (j * 8 + 4)) & 0x0f) + s.charAt((n >> (j * 8)) & 0x0f);
    return out;
  }
  function add(x, y) {
    return (((x & 0xffff) + (y & 0xffff)) & 0xffff) + ((((x >>> 16) + (y >>> 16)) & 0xffff) << 16);
  }
  function rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
  function cmn(q, a, b, x, s, t) { return add(rol(add(add(a, q), add(x, t)), s), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
  function str2blks_MD5(str) {
    const nblk = ((str.length + 8) >> 6) + 1;
    const blks = new Array(nblk * 16).fill(0);
    for (let i = 0; i < str.length; i++) blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    blks[str.length >> 2] |= 0x80 << ((str.length % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks;
  }
  const x = str2blks_MD5(input);
  let a = 1732584193; let b = -271733879; let c = -1732584194; let d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;
    a = ff(a, b, c, d, x[i+0], 7, -680876936);
    d = ff(d, a, b, c, x[i+1], 12, -389564586);
    c = ff(c, d, a, b, x[i+2], 17, 606105819);
    b = ff(b, c, d, a, x[i+3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+4], 7, -176418897);
    d = ff(d, a, b, c, x[i+5], 12, 1200080426);
    c = ff(c, d, a, b, x[i+6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+7], 22, -45705983);
    a = ff(a, b, c, d, x[i+8], 7, 1770035416);
    d = ff(d, a, b, c, x[i+9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7, 1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22, 1236535329);
    a = gg(a, b, c, d, x[i+1], 5, -165796510);
    d = gg(d, a, b, c, x[i+6], 9, -1069501632);
    c = gg(c, d, a, b, x[i+11], 14, 643717713);
    b = gg(b, c, d, a, x[i+0], 20, -373897302);
    a = gg(a, b, c, d, x[i+5], 5, -701558691);
    d = gg(d, a, b, c, x[i+10], 9, 38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+4], 20, -405537848);
    a = gg(a, b, c, d, x[i+9], 5, 568446438);
    d = gg(d, a, b, c, x[i+14], 9, -1019803690);
    c = gg(c, d, a, b, x[i+3], 14, -187363961);
    b = gg(b, c, d, a, x[i+8], 20, 1163531501);
    a = gg(a, b, c, d, x[i+13], 5, -1444681467);
    d = gg(d, a, b, c, x[i+2], 9, -51403784);
    c = gg(c, d, a, b, x[i+7], 14, 1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    a = hh(a, b, c, d, x[i+5], 4, -378558);
    d = hh(d, a, b, c, x[i+8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16, 1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+1], 4, -1530992060);
    d = hh(d, a, b, c, x[i+4], 11, 1272893353);
    c = hh(c, d, a, b, x[i+7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4, 681279174);
    d = hh(d, a, b, c, x[i+0], 11, -358537222);
    c = hh(c, d, a, b, x[i+3], 16, -722521979);
    b = hh(b, c, d, a, x[i+6], 23, 76029189);
    a = ii(a, b, c, d, x[i+0], 6, -198630844);
    d = ii(d, a, b, c, x[i+7], 10, 1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6, 1700485571);
    d = ii(d, a, b, c, x[i+3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+1], 21, -2054922799);
    a = add(a, olda); b = add(b, oldb); c = add(c, oldc); d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}

function urlencodePhp(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+");
}

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
        status: 405, headers: { "content-type": "application/json" }
      });
    }

    const env = process.env;
    const MODE = (env.PAYFAST_MODE || "sandbox").trim().toLowerCase();
    const MERCHANT_ID = (env.PAYFAST_MERCHANT_ID || "").trim();
    const MERCHANT_KEY = (env.PAYFAST_MERCHANT_KEY || "").trim();
    const PASSPHRASE = (env.PAYFAST_PASSPHRASE || "").trim();
    const RETURN_URL = (env.PAYFAST_RETURN_URL || "").trim();
    const CANCEL_URL = (env.PAYFAST_CANCEL_URL || "").trim();
    const NOTIFY_URL = (env.PAYFAST_NOTIFY_URL || "").trim();

    if (!MERCHANT_ID || !MERCHANT_KEY || !PASSPHRASE || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL) {
      return new Response(JSON.stringify({ ok: false, error: "Missing PayFast configuration" }), {
        status: 200, headers: { "content-type": "application/json" }
      });
    }

    const amount = "99.00";
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,
      subscription_type: 1,
      frequency: 3,
      amount,
      recurring_amount: amount,
      item_name: "Ghosthome Monthly",
    };

    const keys = Object.keys(fields).sort();
    const base = keys.map(k => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`).join("&")
                + `&passphrase=${urlencodePhp(PASSPHRASE)}`;
    const signature = md5(base);

    const engine = MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

    return new Response(JSON.stringify({ ok: true, engine, fields: { ...fields, signature } }), {
      status: 200, headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: `payfast-initiate edge crash: ${e?.message || e}` }), {
      status: 200, headers: { "content-type": "application/json" }
    });
  }
}
