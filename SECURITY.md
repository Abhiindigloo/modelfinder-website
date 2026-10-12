# Security design and release limits

The static Model Finder website runs usage analysis, prompt generation, and estimates in the browser. It has no application server, provider connections, authentication, payments, or paid entitlement gate. Do not add secrets to this repository.

## Controls

- Only same-origin scripts/styles/images; no remote libraries or fonts.
- Meta CSP denies network connections, objects, base URL changes, and form submissions. Referrer policy is no-referrer.
- All imported labels render through textContent; no eval or HTML insertion.
- JSON import caps: 2 MiB, 10,000 records; bounded numeric and string fields; strict timezone-qualified timestamps; calendar dates validated.
- Imported records remain in tab memory, with a clear action and no storage persistence. Async imports cannot restore data after Clear or another selection.
- Unknown costs are tracked separately, never reported as verified zero spend.
- Synthetic demonstration is explicitly labeled; no account connection is implied.

## Tests

Run `node --test tests/analytics.test.cjs` for aggregation, ranges, malformed inputs, malicious labels, and model memory calculations. Browser QA must confirm labels render literally and forms work with CSP enabled.

## Hosting limits and future paid service

GitHub Pages provides HTTPS but does not allow this project to set arbitrary response headers. Meta CSP cannot enforce frame-ancestors, HSTS, Permissions-Policy, or X-Content-Type-Options. A host with response-header control is needed for those controls. No claim of penetration testing, certification, or complete security is made.

A paid analytics service requires a backend with authentication, server-side entitlement checks, signed payment-webhook verification with replay protection/idempotency, rate limits, secure cookies, secret management, data-retention/deletion rules, and a private vulnerability-reporting channel. A checkout redirect or browser flag alone must never unlock paid access. These systems are not implemented in this static preview.

To report a vulnerability, check the repository Security page for private reporting. If unavailable, request a private contact channel in a public issue without posting exploit details or secrets.
