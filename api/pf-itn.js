/* eslint-disable */
// /api/pf-itn.js — TEMP: always 200 OK
module.exports = (req, res) => {
  try {
    res.status(200).send("OK");
  } catch {
    res.status(200).send("OK");
  }
};
