import { createFileRoute, Link } from "@tanstack/react-router";
import { Doc } from "@/components/site-shell";

export const Route = createFileRoute("/start")({
  head: () => ({ meta: [{ title: "Get started · Model Finder" }] }),
  component: StartPage,
});

function StartPage() {
  return (
    <Doc eyebrow="MODEL FINDER / GET STARTED" title="Choose your starting point.">
      <h2>Use analytics in your browser</h2>
      <p>
        <Link to="/analytics" className="inline-flex min-h-11 items-center rounded-md bg-ink px-5 text-sm font-semibold text-paper no-underline">
          Open analytics
        </Link>
      </p>
      <p>
        The browser analytics preview is free. It includes local JSON usage analysis and
        model-weight memory estimates. It does not unlock a paid service.
      </p>
      <h2>Download the skills plugin</h2>
      <p>
        <a href="https://github.com/Abhiindigloo/modelfinder-website/raw/feat/react-model-finder/downloads/model-finder-1.0.4-preparation.zip">
          Download Model Finder 1.0.4 ZIP
        </a>
      </p>
      <p>
        This is a preparation package, not a marketplace-approved release. For compatible clients
        that support local skill plugins, follow that client’s import instructions. This download
        does not install a plugin in ChatGPT. No public marketplace install URL has been verified.
      </p>
      <h2>Paid analytics</h2>
      <p>
        Indigloo intends to offer paid model analytics. Pricing, billing terms, and checkout are
        not configured. No payments are accepted here. Use the free preview while commercial
        details are finalized.
      </p>
      <h2>Publisher</h2>
      <p>
        Published by <strong>Indigloo</strong>. Marketplace publisher verification is pending.
      </p>
    </Doc>
  );
}
