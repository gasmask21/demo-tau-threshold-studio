# τ Threshold Studio

Interactive playground for **JevAgentHarness-style confidence thresholds**: drag τ, watch agent steps flip **accept ↔ defer**, and fit τ from shadow-mode trajectories.

Fixed τ=0.5 burns ~**21.5** success points in the paper framing; a **fitted** threshold (~0.99–1.00) keeps success while cutting cost (~**14.2%**).

- **Demo guide:** [DEMO.md](./DEMO.md)
- **Features map:** [features/README.md](./features/README.md)
- **Verify skill:** [.cursor/skills/verify-tau-threshold-studio/SKILL.md](./.cursor/skills/verify-tau-threshold-studio/SKILL.md)
- **Paper:** [arXiv:2610.21412](https://arxiv.org/abs/2610.21412)

## Quick start

```bash
npm install
npm run dev
```

## Build (Netlify)

```bash
npm run build   # → dist/
```

`netlify.toml` sets `publish = "dist"` and an SPA fallback.

## Fixtures

No API keys. Canned DecisionGym-like episode + 3 shadow runs:

- `public/fixtures/episode.json`
- `public/fixtures/shadow-run-{1,2,3}.json`
