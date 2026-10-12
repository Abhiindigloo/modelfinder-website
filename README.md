# Model Finder website

A responsive, dependency-free public website for the Model Finder skills-only plugin.

## Run locally

Run `python3 -m http.server 8000` from this directory and open http://localhost:8000.

## Publish

GitHub Pages serves the repository root from the main branch. No build step or API key is required.

## Contents

Home, browser-local comparison prompt builder and token cost calculator, support, privacy, and terms pages. No provider API calls are made. User inputs are not persisted or transmitted by the application. GitHub hosting and public issues have their own data practices.

Model Finder public marketplace availability is not asserted. No live provider pricing or measured benchmark claims are included.

## Analytics preview

Open `analytics.html`. Import a JSON array using the schema shown on the page, or load explicitly synthetic example data. Imports stay in tab memory and are not persisted or transmitted. This is a generic format; automatic provider-export conversion is not included.

Model memory uses total stored parameters and precision to estimate binary GiB of weights, then applies a user-selected overhead. It does not model KV cache, concurrency, or establish runtime fit.

## Security and commercial status

See SECURITY.md. Browser analytics is a free preview. Paid analytics pricing, checkout, entitlements, and the official marketplace installation URL remain pending. Never advertise paid access until those systems are implemented and verified. The downloadable plugin ZIP is a preparation artifact, not an approved release.
