# Model Finder — React app

TanStack Start port of the public site. The repository root stays the static GitHub Pages site. This folder is the app-builder source, not a second Pages publish.

Fixes compared with the static site:

- Phone navigation keeps Analytics, Get started, and Support. The static CSS hid the first nav link below 850px.
- USD formatting keeps sub-cent amounts (for example `$0.0027`) instead of rounding them to `$0.00`.
- Replacing an in-memory usage import asks for confirmation. Clear still discards immediately.
- Import validation rejects bidirectional and zero-width characters in labels.

Browser analytics still stays in tab memory. There is no account, upload, or paid checkout. The plugin ZIP on the static site remains the preparation download.

Run the usage tests with:

```
node --experimental-strip-types --test src/lib/usage.test.ts
```
