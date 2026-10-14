import { useState } from "react";
import { formatUsd } from "@/lib/money";

function readNumber(value: string, integer: boolean): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  if (integer && !Number.isInteger(n)) return null;
  return n;
}

export function CostCalculator() {
  const [requests, setRequests] = useState("10000");
  const [inputTokens, setInputTokens] = useState("1000");
  const [outputTokens, setOutputTokens] = useState("300");
  const [inputPrice, setInputPrice] = useState("");
  const [outputPrice, setOutputPrice] = useState("");
  const [touched, setTouched] = useState(false);

  const req = readNumber(requests, true);
  const input = readNumber(inputTokens, true);
  const output = readNumber(outputTokens, true);
  const inPrice = readNumber(inputPrice, false);
  const outPrice = readNumber(outputPrice, false);
  const pricesMissing = inputPrice.trim() === "" || outputPrice.trim() === "";
  const invalid =
    req === null || input === null || output === null || inPrice === null || outPrice === null;
  const total =
    !invalid && req !== null && input !== null && output !== null && inPrice !== null && outPrice !== null
      ? (req * (input * inPrice + output * outPrice)) / 1_000_000
      : null;

  let message = "Enter both prices to estimate";
  if (touched) {
    if (pricesMissing && req !== null && input !== null && output !== null) {
      message = "Enter both token prices to estimate";
    } else if (invalid || total === null || !Number.isFinite(total)) {
      message = "Enter whole request and token counts, and non-negative prices.";
    } else {
      message = `${formatUsd(total)} / month (estimated)`;
    }
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      onInput={() => setTouched(true)}
      className="min-w-0"
    >
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field id="requests" label="Requests / month" value={requests} onChange={setRequests} integer />
        <Field id="input-tokens" label="Input tokens / request" value={inputTokens} onChange={setInputTokens} integer />
        <Field id="output-tokens" label="Output tokens / request" value={outputTokens} onChange={setOutputTokens} integer />
        <Field id="input-price" label="USD / million input tokens" value={inputPrice} onChange={setInputPrice} placeholder="Verified price" />
        <Field id="output-price" label="USD / million output tokens" value={outputPrice} onChange={setOutputPrice} placeholder="Verified price" />
      </div>
      <output className="mt-2 block text-2xl" aria-live="polite">
        {message}
      </output>
      <p className="mt-3 max-w-md text-xs leading-relaxed text-muted">
        Requests × (input tokens × input rate + output tokens × output rate) ÷ 1,000,000. Token
        charges only. Tools, storage, cache discounts, and taxes are excluded. Amounts under one
        cent stay visible.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  integer,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  integer?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        step={integer ? 1 : "any"}
        inputMode={integer ? "numeric" : "decimal"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mb-5 w-full rounded-md border border-line bg-card px-3 py-3 text-sm text-ink"
      />
    </div>
  );
}
