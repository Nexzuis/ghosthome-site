import { useState } from "react";

export default function Pay() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [dbg, setDbg] = useState(null);
  const [amount, setAmount] = useState("99");

  const params = new URLSearchParams(window.location.search);
  const signupId = params.get("signupId");
  const result = params.get("result");

  async function start() {
    setBusy(true);
    setErr("");
    setDbg(null);
    try {
      const r = await fetch(`/api/pf-init?signupId=${encodeURIComponent(signupId)}`, {
        method: "POST"
      });
      const j = await r.json().catch(() => null);

      if (j && j.ok && j.engine && j.fields) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = j.engine;

        Object.entries(j.fields).forEach(([k, v]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = String(k);
          input.value = String(v);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      setErr(j?.error || `Server error${!r.ok ? ` (HTTP ${r.status})` : ""}`);
    } catch (e) {
      setErr(e?.message || "Failed to contact server");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold">Payment</h1>

      {err && (
        <div className="mt-6 rounded-xl border p-5 bg-red-50 border-red-200 text-red-800">
          <p className="font-medium">Error</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap break-all">{err}</pre>
        </div>
      )}

      {dbg && (
        <div className="mt-6 rounded-xl border p-5 bg-slate-50 border-slate-200 text-slate-800">
          <p className="font-medium">Debug (fields posted)</p>
          <pre className="text-xs mt-2 whitespace-pre-wrap break-all">
            {JSON.stringify(dbg, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6">
        {result === "success" ? (
          <div>
            <div className="rounded-xl border p-5 bg-green-50 border-green-200 text-green-800 mb-5">
              <p className="font-medium">Payment successful!</p>
              <p className="text-sm mt-1">
                Thank you — your subscription has been activated.<br/>
                We will be in touch shortly with your account details.<br/>
                In the meantime, please upload your documents <a href="/upload" className="underline font-medium">here</a>!
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={start}
            disabled={busy}
            className="inline-flex items-center rounded-xl px-5 py-3 bg-black text-white hover:bg-gray-900 disabled:opacity-60"
          >
            {busy ? "Contacting PayFast…" : "Pay with PayFast"}
          </button>
        )}
      </div>
    </div>
  );
}
