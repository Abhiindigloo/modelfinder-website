import { createFileRoute, Link } from "@tanstack/react-router";
import { CostCalculator } from "@/components/cost-calculator";
import { PromptBuilder } from "@/components/prompt-builder";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Find your fit · Model Finder" }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest">MODEL FINDER · BY INDIGLOO</p>
            <h1 className="font-display text-5xl leading-none font-medium tracking-tight sm:text-7xl">
              Find your fit.
              <br />
              <em className="font-normal">Skip the hype.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              The most expensive AI model isn’t always the right one. Compare your options and
              discover what meets your quality bar.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a href="#toolkit" className="inline-flex min-h-11 items-center rounded-md bg-ink px-5 text-sm font-semibold text-paper no-underline">
                Build your comparison prompt
              </a>
              <a href="#how" className="text-sm underline">
                Meet Model Finder
              </a>
            </div>
            <p className="mt-10 text-xs tracking-wide text-muted">
              EXPLORE ACROSS PROVIDERS
              <span className="mt-1 block text-sm">OpenAI · Anthropic · Google · open-weight models</span>
            </p>
          </div>
          <div className="decision" aria-label="Choosing a model by quality, cost, and speed">
            <div className="absolute inset-x-6 top-5 flex justify-between text-xs tracking-widest">
              <span>THE DECISION SPACE</span>
              <span>01 / EXPLORE</span>
            </div>
            <div className="decision-orbit size-40 md:size-52" />
            <div className="decision-orbit size-64 md:size-80" />
            <div className="decision-orbit size-80 md:size-96" />
            <div className="decision-core">
              Your
              <br />
              <em>best fit.</em>
              <span className="mt-3 block font-sans text-xs tracking-widest">DEFINED BY YOUR TASK</span>
            </div>
            <span className="decision-node top-[22%] left-[8%]">Quality</span>
            <span className="decision-node top-1/2 right-[6%] bg-lime">Cost</span>
            <span className="decision-node bottom-[18%] left-[14%]">Speed</span>
            <p className="absolute right-5 bottom-4 text-xs">
              No universal winner.
              <br />
              Just a better match.
            </p>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 md:grid-cols-5">
            <div className="md:col-span-3">
              <p className="mb-3 text-xs font-semibold tracking-widest">BROWSER ANALYTICS</p>
              <h2 className="font-display text-4xl font-medium tracking-tight">
                See your usage.
                <br />
                Size your next model.
              </h2>
              <p className="mt-4 max-w-lg text-muted">
                Import a usage JSON export to explore requests, tokens, sessions, activity, and
                reported costs. Estimate model-weight memory from parameters and precision.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link to="/analytics" className="inline-flex min-h-11 items-center rounded-md bg-ink px-5 text-sm font-semibold text-paper no-underline">
                  Open analytics
                </Link>
                <Link to="/start" className="inline-flex min-h-11 items-center text-sm underline">
                  Plugin download and plans
                </Link>
              </div>
            </div>
            <aside className="rounded-lg bg-sage p-6 md:col-span-2">
              <strong>Your data stays in this tab.</strong>
              <p className="mt-2 text-sm">No API keys. No account connection. No application upload.</p>
              <p className="mt-3 text-xs text-muted">
                Free browser preview. Paid analytics and marketplace installation are pending setup.
              </p>
            </aside>
          </div>
        </section>

        <section id="how" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="mb-3 text-xs font-semibold tracking-widest">A LITTLE STRUCTURE. A BETTER DECISION.</p>
            <h2 className="max-w-xl font-display text-4xl font-medium tracking-tight">
              From “which model?” to a shortlist you can test.
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                ["01", "Define the job", "Describe the input, expected output, budget, privacy needs, and what a good answer looks like."],
                ["02", "Compare the tradeoffs", "Ask Model Finder to research suitable providers, current pricing, capabilities, and deployment options."],
                ["03", "Test your quality bar", "Use representative examples and a clear pass threshold. Choose the cheapest candidate that passes."],
              ].map(([n, title, body]) => (
                <article key={n} className="border-t border-line pt-5">
                  <span className="font-display text-3xl text-moss italic">{n}</span>
                  <h3 className="mt-4 text-xl font-medium">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="toolkit" className="bg-ink text-paper">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-widest">MAKE IT SPECIFIC</p>
              <h2 className="font-display text-4xl font-medium tracking-tight">
                Your next <em className="text-lime">comparison starts here.</em>
              </h2>
              <p className="mt-4 max-w-md text-paper/80">
                Build a brief to paste into Model Finder in ChatGPT. This app creates prompts. It
                does not call model APIs or run benchmarks.
              </p>
              <p className="mt-4 text-xs text-paper/70">
                If Model Finder is installed, select it in ChatGPT before sending your prompt.
                Public marketplace availability is not confirmed.
              </p>
            </div>
            <PromptBuilder />
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-widest">CHECK THE MATH</p>
              <h2 className="font-display text-4xl font-medium tracking-tight">What might it cost?</h2>
              <p className="mt-4 max-w-md text-muted">
                Enter your own provider prices. This estimate covers token charges only.
              </p>
            </div>
            <CostCalculator />
          </div>
        </section>

        <section className="px-5 py-20 text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest">EVIDENCE OVER LEADERBOARDS</p>
          <h2 className="font-display text-4xl font-medium tracking-tight">
            Your examples are the benchmark that matters.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Model Finder guides research and evaluation planning. Recommendations are task-specific,
            and provider prices and availability can change.
          </p>
          <a href="#toolkit" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-ink px-5 text-sm font-semibold text-paper no-underline">
            Start with your task
          </a>
        </section>
      </main>
    </SiteShell>
  );
}
