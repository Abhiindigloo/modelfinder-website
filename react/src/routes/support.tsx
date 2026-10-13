import { createFileRoute, Link } from "@tanstack/react-router";
import { Doc } from "@/components/site-shell";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support · Model Finder" }] }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <Doc eyebrow="MODEL FINDER / SUPPORT" title="Let’s make it useful.">
      <h2>Get help or report an issue</h2>
      <p>
        Use the{" "}
        <a href="https://github.com/Abhiindigloo/modelfinder-website/issues">GitHub issue tracker</a>{" "}
        for bugs, accessibility problems, or questions. A GitHub account is required to post.
      </p>
      <p>
        Include what you expected, what happened, and the browser or plugin version. Do not post
        API keys, private prompts, personal information, or confidential documents. Issues are
        public.
      </p>
      <h2>Analytics imports</h2>
      <p>
        See the <Link to="/analytics">usage JSON format</Link>. Existing provider exports may need
        conversion. No provider connection is included. Report format problems using synthetic
        records only.
      </p>
      <h2>Using Model Finder</h2>
      <p>
        Select the installed Model Finder plugin in ChatGPT and describe your task and quality
        requirements. The prompt builder on the home page can help you write that brief.
      </p>
      <p>
        This app does not install the plugin, query providers, or execute evaluations. Model Finder
        provides research and planning guidance using the tools available in its host.
      </p>
    </Doc>
  );
}
