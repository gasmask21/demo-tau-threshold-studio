# τ Threshold Studio — demo guide

**Repo / package:** `tau-threshold-studio`  
**Stack:** Vite + React + TypeScript + Chart.js · Netlify static (`netlify.toml` → `dist`)  
**Keys:** none — all data in `/public/fixtures`

## What you show (30–60 s)

1. Open the preview. Brand **τ Threshold Studio** is the hero.
2. Point at the **must-ask** step (S3): cancel≈0.37 vs ask_user≈0.63.
3. Preset **Fixed 0.5** → green accepts include risky mid-confidence steps → **High risk · −21.5 pts** badge.
4. Drag τ toward **1.0** — watch ≥2 steps flip green→amber (accept→defer).
5. Click **Fit from shadow runs** → fitted τ ≥ 0.95, chart bins, **Low risk · ~14.2% savings**.
6. Optional: **Explain modes** drawer (Cascade vs Replace).

## Local

```bash
npm install
npm run dev
# or
npm run build && npm run preview
```

## Netlify

- Build: `npm run build`
- Publish: `dist`
- SPA redirect already in `netlify.toml`

## Pass / fail

| Check | Expected |
|-------|----------|
| Build | `npm run build` exits 0 |
| Slider 0.5→1.0 | ≥2 steps accept→defer |
| Fixed 0.5 | High risk badge |
| Fitted / Fit-from-shadow | Low risk + savings; τ ≥ 0.95 |
| Offline | After first load, fixtures cached / bundled via fetch to same origin — works offline if assets cached |

## Paper anchors

- Fitted vs fixed threshold: arXiv [2610.21412](https://arxiv.org/abs/2610.21412) §2 / Table 2
- Fixed τ=0.5 lost **21.5** points; fitted cascades ~**14.2%** cost cut (viral X framing)
