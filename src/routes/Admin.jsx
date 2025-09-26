import React, { useEffect, useState } from "react";
import { Copy, RefreshCw, Shield, Link2 } from "lucide-react";

export default function Admin() {
  const [pw, setPw] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  async function load() {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/admin-list?pw=${encodeURIComponent(pw)}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Failed");
      setRows(data.rows || []);
    } catch (e) {
      setError(e.message || "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function copy(token, id) {
    const url = `${window.location.origin}/upload/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-300">
          <Shield className="h-4 w-4" />
          Admin console
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Signups & Documents</h1>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="password"
          placeholder="Admin password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCw className="h-4 w-4" />
          Load
        </button>
        {loading ? <span className="text-sm text-slate-600">Loading…</span> : null}
        {error ? <span className="text-sm text-rose-700">{error}</span> : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Plan</Th><Th>Billing</Th><Th>Status</Th><Th>Docs</Th><Th>Upload link</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-200">
                <Td>{r.full_name}</Td>
                <Td className="text-slate-700">{r.email}</Td>
                <Td>{r.phone}</Td>
                <Td className="uppercase">{r.plan}</Td>
                <Td>{r.billing}</Td>
                <Td>
                  <span className={[
                    "rounded-full px-2 py-0.5 text-xs font-semibold ring-1",
                    r.status === "paid" ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                                        : "bg-slate-100 text-slate-800 ring-slate-200"
                  ].join(" ")}>
                    {r.status}
                  </span>
                </Td>
                <Td>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span>ID: {r.id_docs}</span>
                    <span>POA: {r.poa_docs}</span>
                  </div>
                </Td>
                <Td>
                  {r.upload_token ? (
                    <button
                      onClick={() => copy(r.upload_token, r.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      {copiedId === r.id ? "Copied!" : "Copy link"}
                    </button>
                  ) : <span className="text-xs text-slate-500">—</span>}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Th({ children }) { return <th className="px-3 py-2 text-left font-semibold">{children}</th>; }
function Td({ children, className = "" }) { return <td className={`px-3 py-2 ${className}`}>{children}</td>; }
