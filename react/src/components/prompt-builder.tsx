import { useState, type FormEvent } from "react";

export function PromptBuilder() {
  const [task, setTask] = useState("");
  const [quality, setQuality] = useState("");
  const [budget, setBudget] = useState("");
  const [volume, setVolume] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const job = task.trim();
    const bar = quality.trim();
    if (!job || !bar) return;
    setPrompt(
      `Help me compare AI models across providers for this task: ${job}\n\nMandatory quality requirements: ${bar}\nBudget: ${budget.trim() || "Ask me if needed"}\nUsage: ${volume.trim() || "Ask me if needed"}\n\nVerify current model IDs, deployment routes, capabilities and official pricing. Shortlist suitable candidates and explain tradeoffs. Include Claude and Gemini when they fit. Design an evaluation with representative examples, pass/fail criteria, difficult cases, cost measurements and latency measurements. Recommend the cheapest candidate that passes my mandatory requirements. Distinguish researched facts from assumptions; do not invent test results. Ask about privacy, input size and tool needs if these change the shortlist.`,
    );
    setStatus("");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus("Copied. Paste this into Model Finder in ChatGPT.");
    } catch {
      setStatus("Select the prompt and copy it with your browser’s Copy command.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="min-w-0">
      <label className="mb-2 block text-xs font-semibold" htmlFor="task">
        What do you need AI to do?
      </label>
      <textarea
        id="task"
        required
        maxLength={2000}
        rows={3}
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="e.g. Summarize customer support conversations"
        className="mb-5 w-full rounded-md border border-line bg-card px-3 py-3 text-sm text-ink"
      />
      <label className="mb-2 block text-xs font-semibold" htmlFor="quality">
        What must a good result achieve?
      </label>
      <textarea
        id="quality"
        required
        maxLength={2000}
        rows={2}
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
        placeholder="e.g. Capture every action item and never invent facts"
        className="mb-5 w-full rounded-md border border-line bg-card px-3 py-3 text-sm text-ink"
      />
      <div className="grid gap-x-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold" htmlFor="budget">
            Monthly budget (optional)
          </label>
          <input
            id="budget"
            maxLength={100}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. USD 50"
            className="mb-5 w-full rounded-md border border-line bg-card px-3 py-3 text-sm text-ink"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold" htmlFor="volume">
            Usage (optional)
          </label>
          <input
            id="volume"
            maxLength={100}
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="e.g. 10,000 requests/month"
            className="mb-5 w-full rounded-md border border-line bg-card px-3 py-3 text-sm text-ink"
          />
        </div>
      </div>
      <button type="submit" className="w-full rounded-md bg-lime px-5 py-4 text-sm font-semibold text-ink">
        Generate my prompt
      </button>
      {prompt ? (
        <div className="mt-6">
          <label className="mb-2 block text-xs font-semibold" htmlFor="prompt">
            Your comparison prompt
          </label>
          <textarea
            id="prompt"
            readOnly
            rows={8}
            value={prompt}
            className="mb-4 w-full rounded-md border border-line bg-card px-3 py-3 text-sm text-ink"
          />
          <button
            type="button"
            onClick={copy}
            className="rounded-md border border-line px-4 py-3 text-sm text-paper"
          >
            Copy prompt
          </button>
          <p className="mt-3 text-sm" role="status">
            {status}
          </p>
        </div>
      ) : null}
    </form>
  );
}
