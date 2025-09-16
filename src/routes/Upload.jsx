import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Upload as UploadIcon, CheckCircle2 } from "lucide-react";

export default function Upload() {
  const { token } = useParams();
  const [idFile, setIdFile] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Upload documents — Ghosthome";
  }, []);

  async function uploadOne(kind, file) {
    const res1 = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        kind,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      }),
    });
    if (!res1.ok) throw new Error("Failed to get upload URL");
    const { uploadUrl, blobUrl } = await res1.json();

    // PUT file to signed URL
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!putRes.ok) throw new Error("Upload failed");

    // attach metadata to signup
    const res2 = await fetch("/api/attach-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        kind,
        blob_url: blobUrl,
        filename: file.name,
        size_bytes: file.size,
      }),
    });
    if (!res2.ok) throw new Error("Failed to attach document");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      if (idFile) await uploadOne("id", idFile);
      if (proofFile) await uploadOne("proof", proofFile);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Your link may have expired — please contact support.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload verification documents</h1>
        <p className="mt-1 text-slate-700">
          Your secure link: <span className="font-mono text-xs text-slate-500">{token}</span>
        </p>

        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <ul className="list-disc pl-6">
            <li>Acceptable ID: SA ID, driver’s licence, passport. You may redact the first 6 digits; keep name + last 4 digits + photo visible.</li>
            <li>Proof of address: municipal bill, bank statement, lease (recent).</li>
            <li>Files are encrypted in transit and stored privately; we delete them within 30 days of verification.</li>
          </ul>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">ID document (JPG/PNG/PDF)</div>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600">Proof of address (JPG/PNG/PDF)</div>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
          </div>

        {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</div>}

          <button
            type="submit"
            disabled={busy || (!idFile && !proofFile)}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold",
              busy || (!idFile && !proofFile) ? "bg-emerald-600/60 text-white cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-700"
            ].join(" ")}
          >
            <UploadIcon className="h-4 w-4" /> {busy ? "Uploading..." : "Upload"}
          </button>
        </form>

        {done && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800 ring-1 ring-emerald-200">
            <CheckCircle2 className="h-4 w-4" /> Thanks! We’ll review and activate your access shortly.
          </div>
        )}

        <div className="mt-6">
          <Link to="/" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
