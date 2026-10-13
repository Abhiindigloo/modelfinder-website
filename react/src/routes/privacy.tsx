import { createFileRoute, Link } from "@tanstack/react-router";
import { Doc } from "@/components/site-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy · Model Finder" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Doc eyebrow="MODEL FINDER / PRIVACY" title="Simple by design.">
      <p>Effective October 12, 2026. This notice describes Model Finder and the skills-only plugin.</p>
      <h2>This app</h2>
      <p>
        There are no accounts, advertising scripts, or an application database. Usage imports,
        prompt-builder text, and calculator inputs are processed in your browser. Imported analytics
        records stay in this tab’s memory and clear on reload, tab close, or Clear. Copy writes the
        generated prompt to your clipboard only when you ask.
      </p>
      <h2>Hosting</h2>
      <p>
        The host may process technical request information, including IP addresses, under its own
        policy. External links, including GitHub issues, follow those services’ policies. GitHub
        issues are public.
      </p>
      <h2>The plugin in ChatGPT</h2>
      <p>
        Model Finder is a set of instructions for the host assistant. It has no inference endpoint,
        analytics service, or data store of its own. Messages you send in ChatGPT are handled under
        the host’s policies. This app does not receive those conversations.
      </p>
      <h2>Payments</h2>
      <p>
        No payment processor is connected. Paid analytics is planned but unavailable. Privacy
        disclosures must be updated before payment or account data is collected.
      </p>
      <h2>Questions</h2>
      <p>
        Use the <Link to="/support">support page</Link>. Do not put private information in the public
        issue tracker.
      </p>
    </Doc>
  );
}
