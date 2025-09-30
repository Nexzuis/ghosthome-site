import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  IdCard,
  FileText,
  CheckCircle,
  Upload as UploadIcon,
  ArrowLeft,
} from "lucide-react";

export default function Upload() {
  const [idFile, setIdFile] = useState(null);
  const [poaFile, setPoaFile] = useState(null);
  const [idStatus, setIdStatus] = useState("idle");
  const [poaStatus, setPoaStatus] = useState("idle");
  const [error, setError] = useState("");
  const [signupId, setSignupId] = useState(
    localStorage.getItem("ghosthome_signup_id")
  );

  // State for the lookup form
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);

  async function uploadOne(kind, file, setStatus) {
    if (!file) return;
    setStatus("uploading");
    setError("");

    try {
      const base64 = await toBase64(file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signupId,
          type: kind,
          filename: file.name,
          mimetype: file.type || "application/octet-stream",
          size: file.size || 0,
          base64,
        }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Upload failed");
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e.message || "Upload failed");
    }
  }

  async function lookupSignupId(e) {
    e.preventDefault();
    setError("");
    setLookupBusy(true);

    try {
      const res = await fetch("/api/upload?getSignupId=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim() }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      if (!data?.ok || !data?.signupId) {
        throw new Error(data?.error || "No matching signup found");
      }
      localStorage.setItem("ghosthome_signup_id", data.signupId);
      setSignupId(data.signupId);
    } catch (e) {
      setError(e.message || "Lookup failed");
    } finally {
      setLookupBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <header className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-300">
          <Shield className="h-4 w-4" />
          Secure document upload
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Verify your access
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-slate-700">
          Upload your <strong>ID</strong> and <strong>Proof of Address</strong>. Supported: JPG/PNG/PDF.
        </p>
        <p className="mt-2 max-w-2xl text-slate-700">
          You can also email your documents to: <a href="mailto:ian@ghosthome.co.za">ian@ghosthome.co.za</a><br/>
          Please include your name and address as reference.
        </p>
      </header>

      {!signupId ? (
        <form
          onSubmit={lookupSignupId}
          className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Find your signup
          </h2>
          <p className="text-sm text-slate-600">
            Enter the email or phone number you used when signing up.
          </p>
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="submit"
            disabled={lookupBusy || (!email.trim() && !phone.trim())}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 disabled:opacity-60"
          >
            {lookupBusy ? "Looking up…" : "Continue"}
          </button>
        </form>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* ID Upload */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
                <IdCard className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                ID document
              </h2>
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 p-4">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
              />
              {idFile ? (
                <p className="mt-2 text-xs text-slate-600">
                  Selected: {idFile.name}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => uploadOne("id", idFile, setIdStatus)}
                disabled={!idFile || idStatus === "uploading"}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {idStatus === "uploading" ? (
                  "Uploading…"
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4" /> Upload ID
                  </>
                )}
              </button>
              {idStatus === "done" ? (
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle className="h-4 w-4" /> ID uploaded
                </p>
              ) : null}
            </div>
          </section>

          {/* Proof of Address Upload */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-sky-50 ring-1 ring-sky-200">
                <FileText className="h-5 w-5 text-sky-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Proof of Address
              </h2>
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 p-4">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setPoaFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-700"
              />
              {poaFile ? (
                <p className="mt-2 text-xs text-slate-600">
                  Selected: {poaFile.name}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => uploadOne("poa", poaFile, setPoaStatus)}
                disabled={!poaFile || poaStatus === "uploading"}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {poaStatus === "uploading" ? (
                  "Uploading…"
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4" /> Upload Proof of Address
                  </>
                )}
              </button>
              {poaStatus === "done" ? (
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle className="h-4 w-4" /> Proof of Address uploaded
                </p>
              ) : null}
            </div>
          </section>
        </div>
      )}

      {error ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200">
          {error}
        </p>
      ) : null}

      <p className="mt-6 text-xs text-slate-500">
        Files are encrypted in transit and stored securely. If you uploaded the
        wrong file, re-upload — we keep the latest.
      </p>
    </main>
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const result = String(fr.result || "");
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
