import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatUsd } from "@/lib/money";
import { memory, smallDeviceNote, summarize, validate, type UsageRecord } from "@/lib/usage";

const numberFmt = new Intl.NumberFormat("en-US");

function sampleRecords(): UsageRecord[] {
  const now = Date.now();
  return validate(
    Array.from({ length: 42 }, (_, i) => ({
      timestamp: new Date(now - (i % 14) * 86400000 - (i % 5) * 3600000).toISOString(),
      session_id: `example-session-${i % 12}`,
      model: ["Example model A", "Example model B", "Example model C"][i % 3],
      input_tokens: 500 + i * 35,
      output_tokens: 100 + i * 7,
      cost_usd: i % 4 === 0 ? null : (500 + i * 35) * 0.000001 + (100 + i * 7) * 0.000002,
    })),
  );
}

export function UsageDashboard() {
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const [range, setRange] = useState(0);
  const [status, setStatus] = useState(
    "No account is connected. Import your own JSON or load the synthetic example.",
  );
  const [pending, setPending] = useState<{ records: UsageRecord[]; status: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const generation = useRef(0);
  const recordsRef = useRef(records);
  recordsRef.current = records;

  useEffect(() => {
    setMounted(true);
  }, []);

  const summary = useMemo(() => summarize(records, range), [records, range]);

  function commit(next: UsageRecord[], nextStatus: string) {
    setRecords(next);
    setStatus(nextStatus);
    setPending(null);
  }

  function stage(next: UsageRecord[], nextStatus: string) {
    if (recordsRef.current.length > 0) {
      setPending({ records: next, status: nextStatus });
      return;
    }
    commit(next, nextStatus);
  }

  function loadSample() {
    generation.current += 1;
    stage(
      sampleRecords(),
      "Illustrative example loaded. These are synthetic records, not account usage or provider prices.",
    );
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    const gen = ++generation.current;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error("Choose a file no larger than 2 MiB.");
      const parsed = validate(JSON.parse(await file.text()));
      if (gen !== generation.current) return;
      stage(parsed, `Imported ${numberFmt.format(parsed.length)} records locally. Nothing was uploaded.`);
    } catch (error) {
      if (gen !== generation.current) return;
      const message = error instanceof SyntaxError ? "Invalid JSON." : error instanceof Error ? error.message : "Import failed.";
      setStatus(`Import rejected. ${message} Previous data is unchanged.`);
      setPending(null);
    }
  }

  return (
    <section id="dashboard" className="scroll-mt-24 rounded-xl border border-line bg-card p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-widest">USAGE ANALYTICS</p>
          <h2 className="font-display text-4xl font-medium tracking-tight">Your activity, in view.</h2>
        </div>
        <label className="text-xs font-semibold">
          Time range
          <select
            className="mt-2 block min-h-11 rounded-md border border-line bg-card px-3 text-sm font-normal"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
          >
            <option value={0}>All available</option>
            <option value={30}>Last 30 days</option>
            <option value={7}>Last 7 days</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={loadSample} className="min-h-11 rounded-md bg-ink px-4 text-sm font-semibold text-paper">
          Load illustrative example
        </button>
        <label className="min-h-11 cursor-pointer rounded-md border border-line px-4 py-3 text-sm font-semibold">
          Import usage JSON
          <input
            className="sr-only"
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              void onFile(file);
            }}
          />
        </label>
        <button
          type="button"
          className="min-h-11 rounded-md border border-ink px-4 text-sm"
          onClick={() => {
            generation.current += 1;
            setRecords([]);
            setPending(null);
            setStatus("Dashboard cleared. Imported data is not saved; reload also clears it.");
          }}
        >
          Clear data
        </button>
      </div>

      {pending ? (
        <div className="mt-4 rounded-md border border-line bg-sage p-4" role="alert">
          <p className="text-sm">Replace the current import? The records in this tab will be discarded.</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              className="min-h-11 rounded-md bg-ink px-4 text-sm font-semibold text-paper"
              onClick={() => commit(pending.records, pending.status)}
            >
              Replace
            </button>
            <button
              type="button"
              className="min-h-11 rounded-md border border-ink px-4 text-sm"
              onClick={() => setPending(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-sm" role="status">
        {status}
      </p>
      <p className="mt-2 text-xs text-muted">
        Maximum 2 MiB and 10,000 records. One object per request: timestamp, session_id, model,
        input_tokens, output_tokens, and optional cost_usd.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Sessions" value={numberFmt.format(summary.sessions)} />
        <Stat label="Requests" value={numberFmt.format(summary.requests)} />
        <Stat label="Total tokens" value={numberFmt.format(summary.tokens)} />
        <Stat label="Active days" value={numberFmt.format(summary.activeDays)} />
        <Stat label="Peak hour (UTC)" value={summary.peak === null ? "—" : `${summary.peak}:00`} />
        <Stat label="Top model by requests" value={summary.favorite} />
        <Stat label="Reported spend (USD)" value={summary.knownCosts ? formatUsd(summary.cost) : "Not supplied"} />
      </div>
      <p className="mt-3 text-xs text-muted">
        {summary.knownCosts} of {summary.requests} requests include cost. Totals cover supplied costs
        only. Future records are excluded. Unknown cost is not shown as zero.
      </p>

      <h3 className="mt-8 mb-3 text-lg font-medium">Activity by date (UTC)</h3>
      {summary.dates.length === 0 ? (
        <p className="text-sm text-muted">No activity in this range. Load the example or import your own file.</p>
      ) : mounted ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.dates.map(([date, requests]) => ({ date: date.slice(5), requests }))}>
              <XAxis dataKey="date" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} width={32} tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="requests" fill="var(--color-moss)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-muted">Preparing chart…</p>
      )}

      <h3 className="mt-8 mb-3 text-lg font-medium">Model breakdown</h3>
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Model usage table">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-soft">
              {["Model", "Requests", "Input tokens", "Output tokens", "Reported USD", "Cost coverage"].map((h) => (
                <th key={h} scope="col" className="px-3 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summary.models.map((m) => (
              <tr key={m.name} className="border-b border-line">
                <td className="max-w-xs px-3 py-3 break-words">{m.name}</td>
                <td className="px-3 py-3">{numberFmt.format(m.requests)}</td>
                <td className="px-3 py-3">{numberFmt.format(m.input)}</td>
                <td className="px-3 py-3">{numberFmt.format(m.output)}</td>
                <td className="px-3 py-3">{m.knownCosts ? formatUsd(m.cost) : "Not supplied"}</td>
                <td className="px-3 py-3">
                  {m.knownCosts}/{m.requests}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="min-w-0 rounded-md border border-line bg-soft p-4">
      <span className="block text-xs text-muted">{label}</span>
      <strong className="mt-1 block text-2xl font-medium break-words">{value}</strong>
    </article>
  );
}

export function MemoryForm() {
  const [parameters, setParameters] = useState("7");
  const [bits, setBits] = useState("16");
  const [overhead, setOverhead] = useState("20");
  const [available, setAvailable] = useState("24");

  let weights = "—";
  let estimate = "—";
  let note = "";
  let device = "";
  try {
    if ([parameters, bits, overhead, available].some((v) => v.trim() === "")) {
      throw new Error("Complete all four fields.");
    }
    const result = memory(Number(parameters), Number(bits), Number(overhead), Number(available));
    weights = `${result.weights.toFixed(2)} GiB`;
    estimate = `${result.estimate.toFixed(2)} GiB`;
    note =
      result.headroom >= 0
        ? `${result.headroom.toFixed(2)} GiB remains under these assumptions. This does not establish runtime fit.`
        : `${Math.abs(result.headroom).toFixed(2)} GiB over the entered memory budget, before any additional runtime requirements.`;
    device = smallDeviceNote(Number(available));
  } catch (error) {
    note = error instanceof Error ? error.message : "Check the inputs.";
  }

  return (
    <form id="model-size" onSubmit={(e) => e.preventDefault()} className="scroll-mt-24">
      <div className="grid gap-x-4 sm:grid-cols-2">
        <label className="mb-2 block text-xs font-semibold">
          Total parameters (billions)
          <input
            type="number"
            min={0.001}
            max={10000}
            step="any"
            value={parameters}
            onChange={(e) => setParameters(e.target.value)}
            className="mt-2 mb-4 w-full rounded-md border border-line bg-card px-3 py-3 text-sm font-normal"
          />
        </label>
        <label className="mb-2 block text-xs font-semibold">
          Weight precision
          <select
            value={bits}
            onChange={(e) => setBits(e.target.value)}
            className="mt-2 mb-4 w-full rounded-md border border-line bg-card px-3 py-3 text-sm font-normal"
          >
            <option value="4">4-bit</option>
            <option value="8">8-bit</option>
            <option value="16">16-bit</option>
            <option value="32">32-bit</option>
          </select>
        </label>
        <label className="mb-2 block text-xs font-semibold">
          Overhead allowance (%)
          <input
            type="number"
            min={0}
            max={200}
            step="any"
            value={overhead}
            onChange={(e) => setOverhead(e.target.value)}
            className="mt-2 mb-4 w-full rounded-md border border-line bg-card px-3 py-3 text-sm font-normal"
          />
        </label>
        <label className="mb-2 block text-xs font-semibold">
          Available memory (GiB)
          <input
            type="number"
            min={0}
            max={100000}
            step="any"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
            className="mt-2 mb-4 w-full rounded-md border border-line bg-card px-3 py-3 text-sm font-normal"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Raw weight memory" value={weights} />
        <Stat label="With chosen allowance" value={estimate} />
      </div>
      <p className="mt-3 text-sm" role="status">
        {note}
      </p>
      {device ? <p className="mt-3 text-sm">{device}</p> : null}
    </form>
  );
}
