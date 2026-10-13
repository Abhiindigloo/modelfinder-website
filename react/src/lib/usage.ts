export type UsageRecord = {
  timestamp: string;
  session_id: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number | null;
};

export type ModelRollup = {
  name: string;
  requests: number;
  input: number;
  output: number;
  cost: number;
  knownCosts: number;
};

export type Summary = {
  requests: number;
  sessions: number;
  tokens: number;
  cost: number;
  knownCosts: number;
  activeDays: number;
  favorite: string;
  peak: string | null;
  models: ModelRollup[];
  dates: [string, number][];
};

const TIMESTAMP =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
const UNSAFE_TEXT = /[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/;

export function validate(data: unknown): UsageRecord[] {
  if (!Array.isArray(data) || data.length < 1 || data.length > 10000) {
    throw new Error("Import 1–10,000 records as a JSON array.");
  }
  return data.map((row, i) => {
    const fail = (message: string): never => {
      throw new Error(`Record ${i + 1}: ${message}`);
    };
    if (!row || typeof row !== "object" || Array.isArray(row)) fail("expected an object.");
    const source = row as Record<string, unknown>;
    const text = (key: string, max: number) => {
      const value = source[key];
      if (typeof value !== "string" || !value.trim() || value.length > max || UNSAFE_TEXT.test(value)) {
        fail(`invalid ${key}.`);
      }
      return (value as string).trim();
    };
    const timestamp = text("timestamp", 40);
    if (!TIMESTAMP.test(timestamp) || !Number.isFinite(Date.parse(timestamp))) {
      fail("timestamp must be ISO 8601 with a timezone.");
    }
    const date = timestamp.slice(0, 10);
    if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
      fail("invalid calendar date.");
    }
    const number = (key: string, max: number, integer = false): number => {
      const value = source[key];
      if (
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > max ||
        (integer && !Number.isSafeInteger(value))
      ) {
        fail(`invalid ${key}.`);
      }
      return value as number;
    };
    return {
      timestamp: new Date(timestamp).toISOString(),
      session_id: text("session_id", 128),
      model: text("model", 120),
      input_tokens: number("input_tokens", 1e9, true),
      output_tokens: number("output_tokens", 1e9, true),
      cost_usd: source.cost_usd == null ? null : number("cost_usd", 1e6),
    };
  });
}

export function summarize(records: UsageRecord[], days = 0, now = Date.now()): Summary {
  const cutoff = days ? now - days * 86400000 : -Infinity;
  const filtered = records.filter((r) => {
    const t = Date.parse(r.timestamp);
    return t >= cutoff && t <= now;
  });
  const models = new Map<string, ModelRollup>();
  const dates = new Map<string, number>();
  const hours = new Map<string, number>();
  let tokens = 0;
  let cost = 0;
  let knownCosts = 0;
  for (const r of filtered) {
    tokens += r.input_tokens + r.output_tokens;
    const m = models.get(r.model) ?? {
      name: r.model,
      requests: 0,
      input: 0,
      output: 0,
      cost: 0,
      knownCosts: 0,
    };
    m.requests += 1;
    m.input += r.input_tokens;
    m.output += r.output_tokens;
    if (r.cost_usd !== null) {
      cost += r.cost_usd;
      knownCosts += 1;
      m.cost += r.cost_usd;
      m.knownCosts += 1;
    }
    models.set(r.model, m);
    const date = r.timestamp.slice(0, 10);
    dates.set(date, (dates.get(date) ?? 0) + 1);
    const hour = r.timestamp.slice(11, 13);
    hours.set(hour, (hours.get(hour) ?? 0) + 1);
  }
  const sorted = [...models.values()].sort(
    (a, b) => b.requests - a.requests || a.name.localeCompare(b.name),
  );
  const peak =
    [...hours.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null;
  return {
    requests: filtered.length,
    sessions: new Set(filtered.map((r) => r.session_id)).size,
    tokens,
    cost,
    knownCosts,
    activeDays: dates.size,
    favorite: sorted[0]?.name ?? "—",
    peak,
    models: sorted,
    dates: [...dates.entries()].sort((a, b) => a[0].localeCompare(b[0])),
  };
}

export type MemoryEstimate = { weights: number; estimate: number; headroom: number };

export function smallDeviceNote(available: number): string {
  if (!Number.isFinite(available) || available > 4) return "";
  return "This budget is handset-sized. Do not run several department assistants, a document index, or fine-tunes on the phone. Use the phone as the screen — web, mobile, Teams, or Slack — and keep the models and your business data on a server you control or a private cloud. Smaller than a generalist does not mean it fits in about 3 GB. Fully on this device, only one very small quantized model for one narrow task is a candidate, and that fit is unverified.";
}

export function memory(
  parameters: number,
  bits: number,
  overhead: number,
  available: number,
): MemoryEstimate {
  if (
    ![parameters, bits, overhead, available].every(Number.isFinite) ||
    parameters <= 0 ||
    parameters > 10000 ||
    ![4, 8, 16, 32].includes(bits) ||
    overhead < 0 ||
    overhead > 200 ||
    available < 0 ||
    available > 100000
  ) {
    throw new Error(
      "Enter parameters > 0, a supported precision, overhead 0–200%, and non-negative memory.",
    );
  }
  const weights = (parameters * 1e9 * bits) / 8 / 2 ** 30;
  const estimate = weights * (1 + overhead / 100);
  return { weights, estimate, headroom: available - estimate };
}
