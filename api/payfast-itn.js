// Minimal ITN endpoint. Logs and returns 200 OK so sandbox can complete.
// You can add full signature validation later if you want.

module.exports = async (req, res) => {
  try {
    // PayFast posts form-encoded body. Vercel parses it to req.body if content-type is correct.
    console.log("PayFast ITN hit:", req.body || {});
    res.status(200).send("OK"); // MUST respond 200 fast
  } catch (e) {
    console.error("ITN error:", e);
    res.status(200).send("OK"); // still OK; don't risk retries failing
  }
};
