import { createFileRoute, Link } from "@tanstack/react-router";
import { Doc } from "@/components/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms · Model Finder" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <Doc eyebrow="MODEL FINDER / TERMS" title="Clear expectations.">
      <p>Effective October 12, 2026. These terms cover Model Finder’s informational tools.</p>
      <p>Publisher: Indigloo. Marketplace business verification remains pending.</p>
      <h2>Purpose and access</h2>
      <p>
        Model Finder provides a comparison prompt builder, a token-cost calculator, local JSON usage
        analytics, and model-weight memory estimates. The browser preview is free. A paid analytics
        offering is planned, but pricing and checkout are not configured. Third-party models, APIs,
        and host products may have their own charges and terms.
      </p>
      <h2>Research and estimates</h2>
      <p>
        Nothing here guarantees model accuracy, availability, provider pricing, savings, or
        suitability. Verify current provider information and test representative examples. The cost
        calculator estimates only the token charges you enter. Usage analytics summarizes supplied
        records and does not verify provider bills. Model-size estimates depend on your assumptions
        and do not guarantee hardware fit.
      </p>
      <h2>Your responsibilities</h2>
      <p>
        Use the app lawfully. Do not submit secrets or confidential information to public support
        channels. You remain responsible for selecting providers, handling data, and reviewing
        outputs before use.
      </p>
      <h2>Availability and third parties</h2>
      <p>
        The app is provided as available, without a promise of uninterrupted operation. Third-party
        products and trademarks belong to their owners. Mentioning a provider does not imply
        endorsement.
      </p>
      <h2>Updates and contact</h2>
      <p>
        These terms may be updated with a revised effective date. Questions can be raised through
        the <Link to="/support">support page</Link>. Rights that cannot be excluded under applicable
        law remain unaffected.
      </p>
    </Doc>
  );
}
