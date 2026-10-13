import { createFileRoute } from "@tanstack/react-router";
import { MemoryForm, UsageDashboard } from "@/components/usage-dashboard";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Model analytics · Model Finder" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="mb-3 text-xs font-semibold tracking-widest">MODEL FINDER / BY INDIGLOO</p>
        <h1 className="font-display text-5xl leading-none font-medium tracking-tight sm:text-6xl">
          Understand your <em>model footprint.</em>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Explore usage exports and estimate model-weight memory. Your file stays in this browser
          tab. No provider connection or API key is needed.
        </p>
        <div className="mt-6 flex flex-wrap gap-5">
          <a href="#dashboard" className="inline-flex min-h-11 items-center rounded-md bg-ink px-5 text-sm font-semibold text-paper no-underline">
            Explore usage
          </a>
          <a href="#model-size" className="inline-flex min-h-11 items-center text-sm underline">
            Estimate model size
          </a>
        </div>
        <div className="mt-10">
          <UsageDashboard />
        </div>
        <section className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-widest">MODEL-SIZE ANALYSIS</p>
            <h2 className="font-display text-4xl font-medium tracking-tight">
              Estimate the memory behind the parameters.
            </h2>
            <p className="mt-4 text-muted">
              This is a model-weight estimate, with an overhead allowance you choose. It is not a
              hardware benchmark or a guarantee that a model will run.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Weight GiB = parameters in billions × 1,000,000,000 × bits ÷ 8 ÷ 1,073,741,824. The
              allowance multiplies that by (1 + overhead ÷ 100). KV cache, context, concurrency, and
              activations may need more memory. For mixture-of-experts models, use total stored
              parameters, not only active ones.
            </p>
          </div>
          <MemoryForm />
        </section>
        <section className="mt-16 max-w-3xl border-t border-line pt-12">
          <p className="mb-3 text-xs font-semibold tracking-widest">YOUR DATA, YOUR CONTROL</p>
          <h2 className="font-display text-4xl font-medium tracking-tight">A small, explicit import format.</h2>
          <p className="mt-4 text-muted">
            Use a JSON array with one object per request. Required: a timezone-qualified timestamp,
            session ID, model name, and non-negative integer token counts. USD cost is optional.
            Extra fields are ignored. Remove prompts, responses, secrets, and identifying details
            before importing.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-md bg-ink p-5 text-sm text-paper">{`[{
  "timestamp": "2026-10-12T10:00:00Z",
  "session_id": "session-1",
  "model": "Your model name",
  "input_tokens": 1000,
  "output_tokens": 300,
  "cost_usd": 0.002
}]`}</pre>
        </section>
      </main>
    </SiteShell>
  );
}
