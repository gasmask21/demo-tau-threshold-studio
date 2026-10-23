---
name: verify-tau-threshold-studio
description: Verify the τ Threshold Studio demo — Launch, Doctor, Drive, Evidence, Cleanup. Use when validating accept/defer flips, presets, shadow fit, or Netlify static build.
---

# Verify τ Threshold Studio

Interactive confidence-threshold playground. No API keys. Fixtures in `/public/fixtures`.

## Launch

```bash
npm install
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173/`. For HMR iteration: `npm run dev`.

## Doctor

Run before Drive:

1. `npm run build` exits 0; `dist/` contains `index.html` and assets.
2. `curl -sf http://127.0.0.1:4173/fixtures/episode.json | head` returns JSON with `steps`.
3. `curl -sf http://127.0.0.1:4173/fixtures/shadow-run-1.json` (and `-2`, `-3`) OK.
4. Page title contains `Threshold Studio`; hero shows brand **τ**.
5. Console: no failed fixture fetches.

## Drive

Manual or Playwright-style:

1. **Fixed 0.5** — click `[data-testid=preset-fixed]`. Expect `[data-testid=badge-high-risk]` visible; many `.step-card.accept`.
2. **Slider flip** — set `#tau-slider` from `0.5` → `1.0`. Count steps whose `data-outcome` changes `accept` → `defer`. **Pass if ≥ 2.**
3. **Fitted preset** — click `[data-testid=preset-fitted]` (or after fit). Expect `[data-testid=badge-low-risk]` and savings framing.
4. **Fit from shadow** — click `[data-testid=fit-shadow]`. Expect `[data-testid=fitted-tau]` text with τ ≥ 0.95 and `[data-testid=shadow-chart]` rendered.
5. **Must-ask** — select step with `.must-ask-step`; prob bars show cancel≈0.37 and ask_user≈0.63.
6. **Offline** — DevTools → Offline after first load; reload from cache or confirm UI still interactive without network to external APIs (fixtures are same-origin).

## Evidence

Capture under `artifacts/`:

- `artifacts/slider-accept-defer.png` — timeline with mixed green/amber after mid τ
- `artifacts/preset-fixed-high-risk.png` — Fixed 0.5 + high risk badge
- `artifacts/fitted-low-risk.png` — fitted τ + low risk / savings badge
- Optional: short screen recording of slider drag

Also keep `artifacts/source.tar.gz` for handoff (exclude `node_modules`, `.git`, `dist`, `uploads`, `artifacts`).

## Cleanup

```bash
# stop preview/dev servers listening on 4173/5173
pkill -f "vite preview" || true
pkill -f "vite$" || true
```

Do not delete `artifacts/` evidence from a passing run unless regenerating.

## Pass / fail (summary)

| Criterion | Pass |
|-----------|------|
| Build | `npm run build` OK |
| Accept→defer | ≥2 steps when τ 0.5→1.0 |
| Fixed 0.5 | High risk badge |
| Fitted / Fit-shadow | Low risk + savings; τ ≥ 0.95 |
| Offline | Works after load without external keys |
