// inside your component file
async function createPayfastSession(payload) {
  try {
    const res = await fetch("/api/payfast-initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Try JSON first
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // If Vercel served an HTML error page, surface a readable error
      return { ok: false, error: `Server returned non-JSON (${res.status}).` };
    }

    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error || `HTTP ${res.status}` , debug: data?.debug };
    }
    return { ok: true, redirect: data.redirect, debug: data.debug };
  } catch (e) {
    return { ok: false, error: e.message || "Network error" };
  }
}

// example usage in your button handler:
async function onPayClick() {
  setBusy(true);
  const result = await createPayfastSession({
    plan: selectedPlan,           // "basic" | "plus"
    billing: selectedBilling,     // "monthly" | "annual"
    amount: computedAmount,       // "99.00" etc (string)
    email, name, phone, address,  // whatever you’re collecting
  });
  setBusy(false);

  if (!result.ok) {
    setError(result.error);
    setDebug(result.debug || null);
    return;
  }
  window.location.href = result.redirect; // jump to PayFast
}
