// /api/pf-itn.js
// New ITN route name to avoid old conflicts. Node runtime + pure-JS MD5.

function urlencodePhp(v){return encodeURIComponent(String(v)).replace(/%20/g,"+");}
// reuse same md5 implementation as above (shortened here for space)
function md5(s){function rhex(n){const c="0123456789abcdef";let o="";for(let j=0;j<4;j++)o+=c[(n>>(j*8+4))&15]+c[(n>>(j*8))&15];return o}
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
 a=hh(a,b,c,d,x[i+1],4,-1530992060);d=hh(d,a,b,c,x[i+4],11,1272893353);
 c=hh(c,d,a,b,x[i+7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640);
 a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i+0],11,-358537222);
 c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+6],23,76029189);
 a=ii(a,b,c,d,x[i+0],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);
 c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);
 a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);
 c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799);
 a=add(a,oa);b=add(b,ob);c=add(c,oc);d=add(d,od);}return rhex(a)+rhex(b)+rhex(c)+rhex(d)}

async function handler(req, res) {
  try {
    let raw = "";
    await new Promise((resolve, reject) => {
      req.on("data", c => (raw += c));
      req.on("end", resolve);
      req.on("error", reject);
    });

    const params = {};
    for (const pair of raw.split("&")) {
      if (!pair) continue;
      const [k, v = ""] = pair.split("=");
      params[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, " "));
    }

    const pass = (process.env.PAYFAST_PASSPHRASE || "").trim();
    const q = Object.entries(params)
      .filter(([k, v]) => k !== "signature" && v !== undefined && v !== null && String(v).length > 0)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${urlencodePhp(k)}=${urlencodePhp(v)}`)
      .join("&");
    const calc = md5(q + (pass ? `&passphrase=${urlencodePhp(pass)}` : ""));
    const sigOk = String(params.signature || "").toLowerCase() === calc.toLowerCase();

    console.log("pf-itn", {
      m_payment_id: params.m_payment_id,
      pf_payment_id: params.pf_payment_id,
      status: params.payment_status,
      sigOk
    });

    res.status(200).send("OK");
  } catch (e) {
    console.error("pf-itn error", e);
    res.status(200).send("OK");
  }
}
module.exports = handler;
module.exports.config = { runtime: "nodejs" };
