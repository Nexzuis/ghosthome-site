import React, { useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Resident upload portal (opens via /upload/:token)
 * Calls:
 *  - POST /api/upload-url  -> { uploadUrl, blobUrl }
 *  - PUT uploadUrl         -> uploads the file to Vercel Blob
 *  - POST /api/attach-document { token, kind, blob_url, filename, size_bytes }
 */
export default function Upload() {
  const { token } = useParams();
  const [idStatus, setIdStatus] = useState("idle");      // idle | uploading | done | error
  const [poaStatus, setPoaStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function doUpload(kind, file, setStatus) {
    if (!file) return;
    setStatus("uploading");
    setMessage("");
    try {
      // 1) ask server for a presigned upload URL
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
      if (!res1.ok) throw new Error(`upload-url ${res1.status}`);
      const { uploadUrl, blobUrl } = await res1.json();

      // 2) PUT the file directly to Vercel Blob
      const res2 = await fetch(uploadUrl, { method: "PUT", body: file });
      if (!res2.ok) throw new Error(`blob put ${res2.status}`);

      // 3) Attach document record to signup
      const res3 = await fetch("/api/attach-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          kind,
          blob_url: blobUrl,
          filename: file.name,
          size_bytes: file.size || 0,
        }),
      });
      if (!res3.ok) throw new Error(`attach ${res3.status}`);

      setStatus("done");
      setMessage("Thanks! Your documents have been received. We’ll review shortly.");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setStatus("error");
      setMessage("Upload failed. Please try again or contact support.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Upload your documents
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your secure token: <span className="font-mono">{token}</span>
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Identity document</h2>
            <p className="mt-1 text-xs text-slate-600">ID/Passport. JPG or PDF.</p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="mt-3 block w-full text-sm"
              onChange={(e) => doUpload("id", e.target.files?.[0], setIdStatus)}
            />
            <StatusBadge status={idStatus} />
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">Proof of address</h2>
            <p className="mt-1 text-xs text-slate-600">Utility bill/bank letter. JPG or PDF.</p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="mt-3 block w-full text-sm"
              onChange={(e) => doUpload("proof", e.target.files?.[0], setPoaStatus)}
            />
            <StatusBadge status={poaStatus} />
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </div>
        )}
      </section>
      <p className="mt-3 text-xs text-slate-500">
        We store files in secure cloud storage. POPIA compliant. If you uploaded the wrong file,
        contact ian@ghosthome.co.za and we’ll assist.
      </p>
    </main>
  );
}

function StatusBadge({ status }) {
  const map = {
    idle: { text: "Waiting for file…", cls: "text-slate-500 bg-slate-50 border-slate-200" },
    uploading: { text: "Uploading…", cls: "text-amber-700 bg-amber-50 border-amber-200" },
    done: { text: "Uploaded", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    error: { text: "Error", cls: "text-rose-700 bg-rose-50 border-rose-200" },
  };
  const m = map[status] || map.idle;
  return (
    <div className={`mt-3 inline-flex rounded-md border px-2 py-0.5 text-xs ${m.cls}`}>
      {m.text}
    </div>
  );
}
