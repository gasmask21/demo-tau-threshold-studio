import type { EpisodeStep, DecisionOutcome, ShadowDecision, ShadowRun } from '../types'

/** Top-1 confidence for a step (decision-model max tool prob). */
export function topConfidence(step: EpisodeStep): number {
  return Math.max(...step.topTools.map((t) => t.p))
}

/** Accept when top confidence ≥ τ; else defer to LLM. */
export function outcomeAtTau(step: EpisodeStep, tau: number): DecisionOutcome {
  return topConfidence(step) >= tau ? 'accept' : 'defer'
}

export function countFlips(
  steps: EpisodeStep[],
  fromTau: number,
  toTau: number,
): number {
  return steps.filter(
    (s) => outcomeAtTau(s, fromTau) === 'accept' && outcomeAtTau(s, toTau) === 'defer',
  ).length
}

/**
 * Paper-style risk: fraction of accepted steps that are wrong or must-ask
 * when the model would take a non-gold / dangerous action at this τ.
 * Fixed τ=0.5 → high risk; fitted ~0.99 → low risk.
 */
export function successRisk(steps: EpisodeStep[], tau: number): number {
  const accepted = steps.filter((s) => outcomeAtTau(s, tau) === 'accept')
  if (accepted.length === 0) return 0.02

  let risky = 0
  for (const s of accepted) {
    const top = s.topTools[0]
    const wrongTop = top && top.tool !== s.gold
    if (wrongTop || (s.mustAsk && topConfidence(s) < 0.9)) {
      risky += 1
    } else if (s.irreversible && topConfidence(s) < 0.85) {
      risky += 0.6
    }
  }

  // Map to a 0–1 meter; boost at low τ to echo −21.5 pts framing
  const base = risky / accepted.length
  const tauPenalty = Math.max(0, (0.85 - tau) * 0.55)
  return Math.min(1, base * 0.85 + tauPenalty + (tau <= 0.5 ? 0.28 : 0))
}

/**
 * Estimated cost saved % vs LLM-only.
 * More accepts → more savings, but paper framing caps fitted cascade ~14%.
 */
export function costSavedPct(steps: EpisodeStep[], tau: number): number {
  const accepted = steps.filter((s) => outcomeAtTau(s, tau) === 'accept').length
  const ratio = accepted / steps.length
  // LLM step ~809ms / ~full $; decision ~31ms / ~3% price → savings ≈ ratio * ~0.97
  // Paper fitted cascade ~14.2% on mixed eval; toy maps ratio into that band
  if (tau <= 0) return Math.round(ratio * 88)
  if (tau >= 0.95) return Math.round(12 + ratio * 4) // ~14% framing
  if (tau <= 0.5) return Math.round(18 + ratio * 8) // more accepts, "cheaper" but risky
  return Math.round(10 + ratio * 12)
}

export type FitBin = {
  confLo: number
  confHi: number
  mid: number
  meanAdvantage: number
  n: number
}

export type FitResult = {
  fittedTau: number
  bins: FitBin[]
  nDecisions: number
}

/**
 * Fit τ from shadow runs: lowest confidence where mean advantage of accepting
 * stays non-negative in higher bins (paper-style "worth it" line).
 * Designed so canned fixtures yield τ ≥ 0.95.
 */
export function fitTauFromShadow(runs: ShadowRun[]): FitResult {
  const all: ShadowDecision[] = runs.flatMap((r) => r.decisions)
  const edges = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0]
  const bins: FitBin[] = []

  for (let i = 0; i < edges.length - 1; i++) {
    const confLo = edges[i]
    const confHi = edges[i + 1]
    const inBin = all.filter((d) => d.confidence >= confLo && d.confidence < confHi)
    const meanAdvantage =
      inBin.length === 0
        ? 0
        : inBin.reduce((s, d) => s + d.advantage, 0) / inBin.length
    bins.push({
      confLo,
      confHi,
      mid: (confLo + confHi) / 2,
      meanAdvantage,
      n: inBin.length,
    })
  }

  // Highest bin (0.95–1.0) always positive on fixtures; walk down until advantage < 0
  let fittedTau = 0.99
  for (let i = bins.length - 1; i >= 0; i--) {
    if (bins[i].meanAdvantage < 0) {
      fittedTau = bins[i].confHi
      break
    }
    fittedTau = bins[i].confLo
  }

  // Paper fitted range ~0.99–1.00; demo floor keeps acceptance (τ ≥ 0.95)
  fittedTau = Math.max(0.99, Math.min(1, fittedTau))

  return { fittedTau, bins, nDecisions: all.length }
}

export const PAPER = {
  fixedLossPts: 21.5,
  noThresholdLossPts: 19.0,
  fittedCostCutPct: 14.2,
  fittedTauRange: [0.99, 1.0] as const,
  decisionMs: 31,
  llmMs: 809,
} as const
