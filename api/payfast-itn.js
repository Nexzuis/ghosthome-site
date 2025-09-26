// api/payfast-itn.js
module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }
    // PayFast ITN arrives as form-encoded
    // NOTE: Vercel parses JSON automatically, not form; we just log raw body if available
    // To be robust, accept either.
    const data = req.body || {};
    console.log("ITN:", data);

    // Always 200 so PayFast marks delivery successful
    res.status(200).send("OK");
  } catch (e) {
    // Still 200 to avoid retries storming you during sandbox testing
    res.status(200).send("OK");
  }
};
