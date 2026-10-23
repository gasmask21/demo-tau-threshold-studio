# τ Threshold Studio — features map

Interactive playground for **fitted confidence thresholds** (JevAgentHarness / arXiv:2610.21412). Pure static Vite + React; fixtures under `/public/fixtures`.

| Feature | Path | What it does |
|--------|------|----------------|
| Agent timeline | `src/components/Timeline.tsx` | Scrubbable 10-step DecisionGym-like episode; green **accept** / amber **defer** as τ moves |
| Must-ask step | `public/fixtures/episode.json` step 3 | `ask_user≈0.63` vs `cancel≈0.37` highlighted in probability map |
| State→tool probs | `src/components/ProbBars.tsx` | Horizontal bars for top-2 tools per selected step |
| τ slider + presets | `src/components/TauControls.tsx` | Range 0–1; presets Fixed 0.5, Fitted (~0.99), Always replace (τ=0) |
| Risk / savings meters | `src/components/Meters.tsx` | High-risk badge at τ≤0.5 (−21.5 pts framing); low-risk + ~14% savings at fitted τ |
| Shadow fit | `src/lib/threshold.ts` `fitTauFromShadow` + `ShadowFitChart.tsx` | Loads 3 shadow JSON runs; bins confidence vs advantage; draws τ ≥ 0.95 |
| Explain drawer | `src/components/ExplainDrawer.tsx` | Cascade / Replace / Assist / Guard / Trigger (paper Fig. 3 chrome) |
| Fixtures | `public/fixtures/*` | 1 episode + 3 shadow runs — no API keys |

## Acceptance hooks (for verify skill)

- `#tau-slider` / `[data-testid=tau-slider]` — drag 0.5 → 1.0
- `[data-outcome=accept|defer]` on `.step-card` — recoloring
- `[data-testid=badge-high-risk]` / `badge-low-risk`
- `[data-testid=fit-shadow]` → `[data-testid=fitted-tau]` shows τ ≥ 0.95
