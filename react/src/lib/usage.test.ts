import assert from "node:assert/strict";
import test from "node:test";
import { formatUsd } from "./money.ts";
import { memory, summarize, validate } from "./usage.ts";

const row = (extra: Record<string, unknown> = {}) => ({
  timestamp: "2026-10-12T10:00:00Z",
  session_id: "s1",
  model: "M",
  input_tokens: 1000,
  output_tokens: 300,
  cost_usd: null,
  ...extra,
});

test("aggregation deduplicates sessions and excludes future records", () => {
  const data = validate([
    row(),
    row({ cost_usd: 0.2 }),
    row({ session_id: "s2", model: "N", timestamp: "2026-10-11T10:00:00Z" }),
    row({ timestamp: "2027-01-01T00:00:00Z" }),
  ]);
  const s = summarize(data, 0, Date.parse("2026-10-12T11:00:00Z"));
  assert.equal(s.sessions, 2);
  assert.equal(s.requests, 3);
  assert.equal(s.tokens, 3900);
  assert.equal(s.cost, 0.2);
  assert.equal(s.knownCosts, 1);
  assert.equal(s.favorite, "M");
  assert.equal(s.activeDays, 2);
});

test("time windows normalize offsets to UTC", () => {
  const data = validate([
    row({ timestamp: "2026-10-12T00:30:00+05:30" }),
    row({ timestamp: "2026-09-01T00:00:00Z" }),
  ]);
  const s = summarize(data, 7, Date.parse("2026-10-12T11:00:00Z"));
  assert.equal(s.requests, 1);
  assert.equal(s.dates[0][0], "2026-10-11");
});

test("rejects malformed records and spoofing characters", () => {
  for (const value of [
    null,
    {},
    [],
    [null],
    [row({ input_tokens: -1 })],
    [row({ input_tokens: "100" })],
    [row({ input_tokens: 1.2 })],
    [row({ cost_usd: Infinity })],
    [row({ timestamp: "2026-02-30T12:00:00Z" })],
    [row({ timestamp: "2026-10-12" })],
    [row({ model: "a".repeat(121) })],
    [row({ model: "gpt\u202e4" })],
    Array(10001).fill(row()),
  ]) {
    assert.throws(() => validate(value));
  }
});

test("preserves labels as inert strings and drops extra fields", () => {
  const data = validate([row({ model: "<img src=x onerror=alert(1)>", prompt: "private" })]);
  assert.equal(data[0].model, "<img src=x onerror=alert(1)>");
  assert.equal("prompt" in data[0], false);
});

test("model weights use binary GiB", () => {
  const r = memory(7, 16, 20, 24);
  assert.ok(Math.abs(r.weights - 13.0385160446167) < 1e-10);
  assert.ok(Math.abs(r.estimate - 15.64621925354) < 1e-10);
  assert.ok(r.headroom > 0);
  assert.ok(memory(70, 16, 20, 24).headroom < 0);
});

test("sub-cent USD does not render as zero", () => {
  assert.match(formatUsd(0.0004), /0\.0004/);
  assert.equal(formatUsd(12.5), "$12.50");
  assert.equal(formatUsd(0), "$0.00");
});
