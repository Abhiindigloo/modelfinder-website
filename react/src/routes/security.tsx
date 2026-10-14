import { createFileRoute, Link } from "@tanstack/react-router";
import { Doc } from "@/components/site-shell";

export const Route = createFileRoute("/security")({
  head: () => ({ meta: [{ title: "Security · Model Finder" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <Doc eyebrow="MODEL FINDER / SECURITY" title="Keep your data close.">
      <h2>Processing boundary</h2>
      <p>
        Usage imports, memory estimates, prompt generation, and cost calculations run in your
        browser. There are no application API-key fields and no persistent analytics store. Opening
        pages still sends normal hosting requests.
      </p>
      <h2>Import protections</h2>
      <p>
        JSON imports are limited to 2 MiB and 10,000 records. Required fields and numeric ranges are
        checked. Labels are inserted as text, never as HTML. Control characters and bidirectional
        overrides are rejected. Replacing an existing import asks first. Reload or Clear removes the
        dataset from application memory.
      </p>
      <h2>What this is not</h2>
      <p>
        There is no server-side authentication, billing verification, or paid entitlement. A
        checkout redirect or a browser flag must never unlock paid access. These measures reduce
        risk. They do not mean the product is free of vulnerabilities.
      </p>
      <h2>Report a concern</h2>
      <p>
        Use{" "}
        <a href="https://github.com/Abhiindigloo/modelfinder-website/security">GitHub Security</a> to
        check reporting options. If private reporting is unavailable, open a public issue asking for
        a private contact channel without exploit details, personal data, or credentials. See{" "}
        <Link to="/support">Support</Link>.
      </p>
    </Doc>
  );
}
