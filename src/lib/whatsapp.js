// src/lib/whatsapp.js
const DEFAULT_PHONE = "27794950855"; // country code first, no +, no spaces

/** Build a wa.me link with a prefilled message. */
export function makeWaLink({ phone = DEFAULT_PHONE, message }) {
  const text = encodeURIComponent((message || "").trim());
  return `https://wa.me/${phone}?text=${text}`;
}

/** Nice multi-line message for package enquiries. */
export function packageMessage({ packageName, price }) {
  const page = typeof window !== "undefined" ? window.location.href : "";
  return `
Hi Ghosthome 👋

I'm interested in: ${packageName} (${price}).

My suburb:
Best time to call:
Preferred install window: Weekday / Saturday

Goals (tick): deter ✅ | identify ✅ | evidence ✅

Link: ${page}
`.trim();
}

/** Generic hero/CTA message (no specific package). */
export function genericMessage() {
  const page = typeof window !== "undefined" ? window.location.href : "";
  return `
Hi Ghosthome 👋

Please help me with a CCTV quote.

My suburb:
Best time to call:
Anything specific (e.g. pets/vehicles/line-crossing):

Link: ${page}
`.trim();
}
