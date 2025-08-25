import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");

  return (
    <form
      action="https://formspree.io/f/your-form-id"
      method="POST"
      onSubmit={() => setStatus("sent")}
      className="space-y-4 max-w-xl"
    >
      {/* replace action with your real Formspree ID or swap to Outlook SMTP */}
      <div className="grid md:grid-cols-2 gap-4">
        <input required name="name" placeholder="Full name" className="bg-white border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand w-full text-neutral-900 placeholder-neutral-400" />
        <input required type="email" name="email" placeholder="Email" className="bg-white border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand w-full text-neutral-900 placeholder-neutral-400" />
      </div>
      <input name="phone" placeholder="Phone" className="bg-white border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand w-full text-neutral-900 placeholder-neutral-400" />
      <textarea required name="message" placeholder="Tell us about your home/business" rows="5" className="bg-white border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand w-full text-neutral-900 placeholder-neutral-400" />
      <button className="bg-brand hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl">Send</button>
      {status === "sent" && <p className="text-sm text-neutral-600">Thanks — we’ll reply from info@ghosthome.co.za.</p>}
    </form>
  );
}
