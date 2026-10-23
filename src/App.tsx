import { useEffect, useMemo, useState } from 'react'
import { Timeline } from './components/Timeline'
import { TauControls } from './components/TauControls'
import { Meters } from './components/Meters'
import { ShadowFitChart } from './components/ShadowFitChart'
import { ExplainDrawer } from './components/ExplainDrawer'
import { loadEpisode, loadShadowRuns } from './lib/loadFixtures'
import {
  costSavedPct,
  fitTauFromShadow,
  outcomeAtTau,
  successRisk,
  type FitResult,
} from './lib/threshold'
import type { Episode, PresetId } from './types'
import './App.css'

export default function App() {
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tau, setTau] = useState(0.5)
  const [preset, setPreset] = useState<PresetId>('fixed05')
  const [selectedId, setSelectedId] = useState(3)
  const [fit, setFit] = useState<FitResult | null>(null)
  const [fitting, setFitting] = useState(false)
  const [explainOpen, setExplainOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadEpisode()
      .then((ep) => {
        if (!cancelled) {
          setEpisode(ep)
          const mustAsk = ep.steps.find((s) => s.mustAsk)
          if (mustAsk) setSelectedId(mustAsk.id)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Load failed')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const acceptCount = useMemo(() => {
    if (!episode) return 0
    return episode.steps.filter((s) => outcomeAtTau(s, tau) === 'accept').length
  }, [episode, tau])

  const deferCount = useMemo(() => {
    if (!episode) return 0
    return episode.steps.length - acceptCount
  }, [episode, acceptCount])

  const risk = useMemo(
    () => (episode ? successRisk(episode.steps, tau) : 0),
    [episode, tau],
  )
  const saved = useMemo(
    () => (episode ? costSavedPct(episode.steps, tau) : 0),
    [episode, tau],
  )

  function handleTau(next: number) {
    setTau(next)
    setPreset('custom')
  }

  function handlePreset(id: PresetId, value: number) {
    setPreset(id)
    setTau(value)
  }

  async function handleFit() {
    setFitting(true)
    try {
      const runs = await loadShadowRuns()
      const result = fitTauFromShadow(runs)
      setFit(result)
      setTau(result.fittedTau)
      setPreset('fitted')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fit failed')
    } finally {
      setFitting(false)
    }
  }

  if (error) {
    return (
      <div className="boot-error">
        <h1>τ Threshold Studio</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="boot-loading">
        <p>Loading fixtures…</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="bg-atmosphere" aria-hidden />

      <header className="hero">
        <div className="hero-brand">
          <span className="brand-tau">τ</span>
          <h1 className="brand-name">Threshold Studio</h1>
        </div>
        <p className="hero-lede">
          Drag the confidence threshold. Watch agent steps flip accept ↔ defer — and see why
          fixed 0.5 burns ~21.5 points while a shadow-fitted τ keeps success.
        </p>
        <div className="hero-actions">
          <button type="button" className="ghost-btn" onClick={() => setExplainOpen(true)}>
            Explain modes
          </button>
          <a
            className="ghost-btn linkish"
            href="https://arxiv.org/abs/2610.21412"
            target="_blank"
            rel="noreferrer"
          >
            Paper
          </a>
        </div>
      </header>

      <main className="studio-grid">
        <Timeline
          episode={episode}
          tau={tau}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <div className="right-col">
          <TauControls
            tau={tau}
            onTau={handleTau}
            preset={preset}
            onPreset={handlePreset}
            fittedTau={fit?.fittedTau ?? null}
            onFit={handleFit}
            fitting={fitting}
          />
          <Meters
            risk={risk}
            costSaved={saved}
            tau={tau}
            acceptCount={acceptCount}
            deferCount={deferCount}
          />
        </div>

        <div className="bottom-span">
          <ShadowFitChart fit={fit} tau={tau} />
        </div>
      </main>

      <footer className="site-foot">
        <span>Demo mode · fixtures in /public/fixtures · no API keys</span>
        <span>JevAgentHarness · arXiv:2610.21412</span>
      </footer>

      <ExplainDrawer open={explainOpen} onClose={() => setExplainOpen(false)} />
    </div>
  )
}
