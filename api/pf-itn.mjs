// ITN verification — ESM version. Always 200 OK after computing signature.

import md5 from "md5";
import { readBody } from "./lib/helpers.mjs";
import { getDb, ensureLogTable } from "./lib/db.mjs";
import FormData from "form-data";
import Mailgun from "mailgun.js";

function urlencodePhp(v) {
  return encodeURIComponent(String(v)).replace(/%20/g, "+");
}

async function sendMail(signupId, db) {
  let signup = await db.query({
    text: 'SELECT * FROM signups WHERE id = $1',
    values: [signupId]
  });

  if (signup.rowCount !== 1) {
    return;
  }

  signup = signup.rows[0];

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.eu.mailgun.net"
  });

  try {
    const data = await mg.messages.create("ghosthome.co.za", {
      from: "Ghosthome Welcome <welcome@ghosthome.co.za>",
      to: [signup.email, signup.email_2],
      subject: "Welcome to the Ghosthome network!",
      html: 
        `<html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <style type="text/css" style="display:none;"> P {margin-top:0;margin-bottom:0;} </style>
        </head>
        <body dir="ltr">
        <div id="divRplyFwdMsg">
        <div style="direction: ltr;">&nbsp;</div>
        </div>
        <div style="direction: ltr; text-align: left; text-indent: 0px; background-color: rgb(255, 255, 255); margin: 1em 0px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        Thank you for subscribing to <b>Ghosthome</b>&nbsp;— your payment has been successfully received.</div>
        <div style="direction: ltr; text-align: left; text-indent: 0px; background-color: rgb(255, 255, 255); margin: 1em 0px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        To complete your activation, please follow these quick steps:</div>
        <div style="direction: ltr; text-align: left; text-indent: 0px; background-color: rgb(255, 255, 255); margin: 1em 0px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        1️⃣ <b>Upload your verification documents:</b></div>
        <ul style="direction: ltr; text-align: left; background-color: rgb(255, 255, 255);" data-end="691" data-start="435">
        <li style="font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <div style="direction: ltr; margin: 1em 0px;" role="presentation">A copy of your <b>
        ID</b>&nbsp;and <b>Proof of Residence</b>&nbsp;(not older than 3 months).</div>
        </li><li style="font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <div style="direction: ltr; margin: 1em 0px;" role="presentation">Use the secure upload link on our website:
        <a style="margin: 0px;" data-auth="NotApplicable" data-end="613" data-start="563" data-linkindex="0" title="https://www.ghosthome.co.za/" class="x_x_x_x_x_x_decorated-link x_x_x_x_x_x_OWAAutoLink" id="OWA81bff7f9-c73b-1f57-7502-3bf009c5fdba" href="https://www.ghosthome.co.za/">
        www.ghosthome.co.za</a>.</div>
        </li><li style="font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <div style="direction: ltr; margin: 1em 0px;" role="presentation"><i>(If you’ve already uploaded them, thank you — no need to resend.)</i></div>
        </li></ul>
        <div style="direction: ltr; text-align: left; text-indent: 0px; background-color: rgb(255, 255, 255); margin: 1em 0px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        2️⃣ <b>Verification call:</b></div>
        <ul style="direction: ltr; text-align: left; background-color: rgb(255, 255, 255);" data-end="853" data-start="725">
        <li style="font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <div style="direction: ltr; margin: 1em 0px;" role="presentation">A <b>Ghosthome representative</b>&nbsp;will contact you within 24 hours to confirm your details and complete a short security check.</div>
        </li></ul>
        <div style="direction: ltr; text-align: left; text-indent: 0px; background-color: rgb(255, 255, 255); margin: 1em 0px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        3️⃣ <b>Account setup:</b></div>
        <ul style="direction: ltr; text-align: left; background-color: rgb(255, 255, 255);" data-end="1130" data-start="883">
        <li style="font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <div style="direction: ltr; margin: 1em 0px;" role="presentation">Once verified, you’ll receive an
        <b>email from NX Cloud</b>&nbsp;with your login details.</div>
        </li><li style="font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <div style="direction: ltr; margin: 1em 0px;" role="presentation">You’ll also receive our
        <b>Ghosthome Getting Started Guide</b>, with clear steps and screenshots to help you download the app and access your street cameras.</div>
        </li></ul>
        <div style="direction: ltr; text-align: left; text-indent: 0px; background-color: rgb(255, 255, 255); margin: 1em 0px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        If you need any assistance, reach out anytime at <b>support@ghosthome.co.za</b>&nbsp;— we’re here to help.</div>
        <div style="direction: ltr; text-align: left; text-indent: 0px; background-color: rgb(255, 255, 255); margin: 1em 0px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        Kind regards,<br>
        <b>The Ghosthome Team</b><br>
        <a style="margin: 0px;" data-auth="NotApplicable" data-end="1325" data-start="1275" data-linkindex="1" title="https://www.ghosthome.co.za/" class="x_x_x_x_x_x_decorated-link x_x_x_x_x_x_OWAAutoLink" id="OWA41b9f7be-ac7a-d7f9-bbf1-35444acf67a5" href="https://www.ghosthome.co.za/">www.ghosthome.co.za</a></div>
        <div style="direction: ltr; margin: 0px; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <br>
        </div>
        <div style="direction: ltr; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <br>
        </div>
        <div id="x_Signature">
        <div style="direction: ltr; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <br>
        </div>
        <p style="direction: ltr; text-align: left; text-indent: 0px; line-height: 1.5; background-color: rgb(255, 255, 255); margin: 0px;">
        <span style="font-family: &quot;Arial Narrow&quot;, sans-serif; font-size: 11pt; color: rgb(0, 32, 96);">Mobile
        </span><span style="font-family: &quot;Arial Narrow&quot;, sans-serif; font-size: 11pt; color: currentcolor;">+27 (0)72 853 1083</span></p>
        <p style="direction: ltr; text-align: left; text-indent: 0px; line-height: 1.5; background-color: rgb(255, 255, 255); margin: 0px;">
        <span style="font-family: &quot;Calibri Light&quot;, sans-serif; font-size: 12px; color: rgb(5, 99, 193);"><u>welcome</u></span><span style="font-family: &quot;Calibri Light&quot;, sans-serif; font-size: 12pt; color: rgb(5, 99, 193);"><u>@ghosthome.co.za</u></span></p>
        <p style="direction: ltr; text-align: left; text-indent: 0px; line-height: 1.5; background-color: rgb(255, 255, 255); margin: 0px;">
        <span style="font-family: &quot;Calibri Light&quot;, sans-serif; font-size: 12pt; color: rgb(5, 99, 193);"><u>www.ghosthome.co.za</u></span></p>
        <div style="direction: ltr; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <img size="444389" style="width: 148px; height: 148px; max-width: 983px;" height="148" width="148" id="x_x_x_x_image_0" data-outlook-trace="F:2|T:2" src="https://ghosthome.co.za/images/ghosthome.png"></div>
        <div style="direction: ltr; font-family: Aptos, Aptos_EmbeddedFont, Aptos_MSFontService, Calibri, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <br>
        </div>
        </div>
        </body>
        </html>
        `
      }
    );

    console.log(data);
  } catch (error) {
    console.log(error);
  }
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
            v !== null
        )
        .map(([k, v]) => `${urlencodePhp(k)}=${urlencodePhp(v)}`)
        .join("&") +
      (pass ? `&passphrase=${urlencodePhp(pass)}` : "");

    const posted = String(body.signature || "").trim().toLowerCase();
    const signupId = String(body.m_payment_id || "").trim().toLowerCase();
    const paymentId = String(body.pf_payment_id || body.m_payment_id || "").trim().toLowerCase();
    const paymentStatus = String(body.payment_status || "").trim().toLowerCase();
    const token = String(body.token || "").trim().toLowerCase();
    const calc = md5(base).toLowerCase();
    const ok = posted === calc;

    log = await db.query({
      text:
        `UPDATE signups
        SET pf_payment_id = $1,
          pf_payment_status = $2,
          pf_itn_check = $3,
          pf_token = $5
        WHERE id = $4`,
      values: [
        paymentId, paymentStatus, ok, signupId, token
      ]
    });

    if (paymentStatus === 'complete') {
      await sendMail(signupId, db);
    }

    req.on("error", () => res.status(200).send("OK"));
  } catch {
    console.log(error);
    res.status(200).send("OK");
  }

  res.status(200).send("OK");
}
