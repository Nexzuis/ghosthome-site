import React, { useEffect, useState } from "react";

export default function Admin() {
  const [pass, setPass] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin-list", {
        headers: { Authorization: "Bearer " + pass },
      });
      if (!res.ok) throw new Error("Auth failed or server error");
      const data = await res.json();
      setRows(data.rows || []);
    } catch (e) {
      setError("Could not load signups.");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id, field, value) {
    try {
      const res = await fetch("/api/admin-set-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + pass,
        },
        body: JSON.stringify({ signup_id: id, field, value }),
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      alert("Update failed");
    }
  }

  useEffect(() => {
    document.title = "Admin — Ghosthome";
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin</h1>
        <div className="mt-3 flex gap-2">
          <input
            type="password"
            className="w-60 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Admin password"
          />
          <button
            type="button"
            onClick={load}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {busy ? "Loading..." : "Load signups"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Verify</th>
                <th className="px-3 py-2">Upload link</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{r.full_name}</td>
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">{r.plan}/{r.billing}</td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2">{r.verification_status || "none"}</td>
                  <td className="px-3 py-2 text-xs">{r.upload_token ? `/upload/${r.upload_token}` : "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-50" onClick={() => setStatus(r.id, "status", "active")}>Set Active</button>
                      <button className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-50" onClick={() => setStatus(r.id, "verification_status", "verified")}>Mark Verified</button>
                      <button className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-50" onClick={() => setStatus(r.id, "status", "cancelled")}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && !busy && (
                <tr>
                  <td className="px-3 py-6 text-slate-500" colSpan={8}>No records.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
