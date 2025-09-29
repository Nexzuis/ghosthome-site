
export async function readBody(req) {
  // If Express already parsed it, just return
  if (req.body && Object.keys(req.body).length > 0) {
    return req.body;
  }

  // Otherwise, parse the raw request
  const ct = (req.headers["content-type"] || "").toLowerCase();
  if (ct.includes("application/json")) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    try { return JSON.parse(raw || "{}"); } catch { return {}; }
  }
  if (ct.includes("application/x-www-form-urlencoded")) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    const obj = {};
    for (const pair of raw.split("&")) {
      if (!pair) continue;
      const [k, v=""] = pair.split("=");
      obj[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, " "));
    }
    return obj;
  }

  return {};
}
