import React, { useEffect, useMemo, useState } from "react";

/**
 * Ghosthome Admin (very simple).
 * Secured by a shared password stored in Vercel env: ADMIN_PASSWORD.
 * The UI sends: Authorization: Bearer <password> to:
 *  - /api/admin-list
 *  - /api/admin-set-status
 */
export default function Admin() {
  const [pwd, setPwd] = useState(() => sessionStorage.getItem("adminPwd") || "");
  const [input, setInput] = useState(pwd);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const authed = useMemo(() => !!pwd, [pwd]);

  async function load() {
    if (!pwd) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-list", {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (!res.ok) {
        if (res.status === 401) setError("Unauthorised: check password.");
        else setError(`Error ${res.status}`);
        setRows([]);
      } else {
        const data = await res.json();
        setRows(data.rows || []);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pwd]);

  function handleLockIn() {
    sessionStorage.setItem("adminPwd", input.trim());
    setPwd(input.trim());
  }

  async function setField(id, field, value) {
    if (!pwd) return;
    try {
      const res = await fetch("/api/admin-set-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pwd}`,
        },
        body: JSON.stringify({ signup_id: id, field, value }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await load();
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert("Failed to update. Check console and env.");
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Ghosthome · Admin
        </h1>
        <div className="text-sm text-slate-500">
          {authed ? "Authorised" : "Locked"}
        </div>
      </header>

      {!authed && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Enter admin password</h2>
          <p className="mt-1 text-sm text-slate-600">
            Must match the <span className="font-mono">ADMIN_PASSWORD</span> env var in Vercel.
          </p>
          <div className="mt-4 flex max-w-md gap-2">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••••"
            />
            <button
              onClick={handleLockIn}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {authed && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Sign-ups</h2>
              <p className="text-sm text-slate-600">
                View and manage residents. Use the upload link to request ID/POA.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                Refresh
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem("adminPwd");
                  setPwd("");
                }}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-900"
              >
                Lock
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Resident</th>
                  <th className="px-3 py-2">Plan</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Verification</th>
                  <th className="px-3 py-2">Docs</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                      No sign-ups yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="px-3 py-2">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-800">{r.full_name}</div>
                        <div className="text-xs text-slate-500">{r.email}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs">
                          {r.plan}/{r.billing}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            {r.status}
                          </span>
                          <div className="flex gap-1">
                            <button
                              className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                              onClick={() => setField(r.id, "status", "active")}
                            >
                              active
                            </button>
                            <button
                              className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                              onClick={() => setField(r.id, "status", "cancelled")}
                            >
                              cancel
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700 ring-1 ring-inset ring-indigo-200">
                            {r.verification_status}
                          </span>
                          <div className="flex gap-1">
                            <button
                              className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                              onClick={() => setField(r.id, "verification_status", "verified")}
                            >
                              verify
                            </button>
                            <button
                              className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                              onClick={() => setField(r.id, "verification_status", "pending_review")}
                            >
                              pending
                            </button>
                            <button
                              className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-50"
                              onClick={() => setField(r.id, "verification_status", "rejected")}
                            >
                              reject
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        {r.upload_token ? (
                          <a
                            className="text-emerald-700 underline"
                            href={`/upload/${r.upload_token}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            /upload/{r.upload_token}
                          </a>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          className="rounded bg-slate-800 px-2 py-1 text-xs text-white hover:bg-slate-900"
                          onClick={() => navigator.clipboard.writeText(r.id)}
                          title="Copy signup ID"
                        >
                          Copy ID
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
