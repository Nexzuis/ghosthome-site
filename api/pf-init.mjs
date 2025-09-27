// /api/pf-init.mjs
// PayFast initiate (subscriptions) — MINIMAL + STRICT + DEBUG
// Signature rules (this build): alpha-sort, RAW urlencoding (spaces => %20), append &passphrase, MD5 hex.

function urlencodePhp(v) {
  // RAW urlencoding (like PHP rawurlencode): spaces -> %20
  return encodeURIComponent(String(v));
}

// Tiny dependency-free MD5
function md5(s) {
  function rhex(n){const c="0123456789abcdef";let o="";for(let j=0;j<4;j++)o+=c[(n>>(j*8+4))&15]+c[(n>>(j*8))&15];return o}
  function add(x,y){return(((x&65535)+(y&65535))&65535)+((((x>>>16)+(y>>>16))&65535)<<16)}
  function rol(n,c){return(n<<c)|(n>>>(32-c))}
  function cmn(q,a,b,x,s,t){return add(rol(add(add(a,q),add(x,t)),s),b)}
  function ff(a,b,c,d,x,s,t){return cmn((b&c)|(~b&d),a,b,x,s,t)}
  function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&~d),a,b,x,s,t)}
  function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t)}
  function ii(a,b,c,d,x,s,t){return cmn(c^(b|~d),a,b,x,s,t)}
  function str2blks(str){const n=((str.length+8)>>6)+1;const blks=new Array(n*16).fill(0);
    for(let i=0;i<str.length;i++) blks[i>>2]|=str.charCodeAt(i)<<((i%4)*8);
    blks[str.length>>2]|=128<<((str.length%4)*8); blks[n*16-2]=str.length*8; return blks}
  const x=str2blks(s);let a=1732584193,b=-271733879,c=-1732584194,d=271733878;
  for(let i=0;i<x.length;i+=16){const oa=a,ob=b,oc=c,od=d;
    a=ff(a,b,c,d,x[i+0],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);
    c=ff(c,d,a,b,x[i+2],17,606105819);b=ff(b,c,d,a,x[i+3],22,-1044525330);
    a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);
    c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983);
    a=ff(a,b,c,d,x[i+8],7,1770035416);d=ff(d,a,b,c,x[i+9],12,-1958414417);
    c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
    a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);
    c=ff(c,d,a,b,x[i+14],17,-1502002290);b=ff(b,c,d,a,x[i+15],22,1236535329);
    a=gg(a,b,c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);
    c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i+0],20,-373897302);
    a=gg(a,b,c,d,x[i+5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);
    c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848);
    a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);
    c=gg(c,d,a,b,x[i+3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501);
    a=gg(a,b,c,d,x[i+13],5,-1444681467);d=gg(d,a,b,c,x[i+2],9,-51403784);
    c=gg(c,d,a,b,x[i+7],14,1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);
    a=hh(a,b,c,d,x[i+5],4,-378558);d=hh(d,a,b,c,x[i+8],11,-2022574463);
    c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556);
    a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i+0],11,-358537222);
    c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+6],23,76029189);
    a=ii(a,b,c,d,x[i+0],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);
    c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);
    a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);
    c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799);
    a=add(a,oa);b=add(b,ob);c=add(c,oc);d=add(d,od);
  }
  return rhex(a)+rhex(b)+rhex(c)+rhex(d);
}

function buildSignature(fields, passphrase) {
  const base =
    Object.keys(fields)
      .filter(k => fields[k] !== undefined && fields[k] !== null && String(fields[k]).length > 0)
      .sort()
      .map(k => `${urlencodePhp(k)}=${urlencodePhp(fields[k])}`)
      .join("&") + `&passphrase=${urlencodePhp(passphrase)}`;
  const sig = md5(base).toLowerCase();
  return { base, sig };
}

export default function handler(req, res) {
  try {
    if (req.method !== "POST" && req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const MODE = (process.env.PAYFAST_MODE || "sandbox").trim().toLowerCase();
    const MERCHANT_ID  = (process.env.PAYFAST_MERCHANT_ID  || "").trim();
    const MERCHANT_KEY = (process.env.PAYFAST_MERCHANT_KEY || "").trim();
    const PASSPHRASE   = (process.env.PAYFAST_PASSPHRASE   || "").trim();
    const RETURN_URL   = (process.env.PAYFAST_RETURN_URL   || "").trim();
    const CANCEL_URL   = (process.env.PAYFAST_CANCEL_URL   || "").trim();
    const NOTIFY_URL   = (process.env.PAYFAST_NOTIFY_URL   || "").trim();

    if (!MERCHANT_ID || !MERCHANT_KEY || !RETURN_URL || !CANCEL_URL || !NOTIFY_URL || !PASSPHRASE) {
      return res.status(200).json({ ok: false, error: "Missing config envs" });
    }

    const amount = "99.00"; // two decimals, string

    // Minimal required subscription fields (ALL strings)
    const fields = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      notify_url: NOTIFY_URL,

      subscription_type: "1",   // subscription
      frequency: "3",           // monthly
      cycles: "0",              // indefinite
      amount: amount,           // REQUIRED by PayFast
      recurring_amount: amount, // monthly
      item_name: "Ghosthome Monthly"
    };

    const { base, sig } = buildSignature(fields, PASSPHRASE);
    const engine = MODE === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

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
