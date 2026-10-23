import type { Episode, EpisodeStep } from '../types'
import { outcomeAtTau, topConfidence } from '../lib/threshold'
import { ProbBars } from './ProbBars'

type Props = {
  episode: Episode
  tau: number
  selectedId: number
  onSelect: (id: number) => void
}

function StepCard({
  step,
  tau,
  selected,
  onSelect,
}: {
  step: EpisodeStep
  tau: number
  selected: boolean
  onSelect: () => void
}) {
  const outcome = outcomeAtTau(step, tau)
  const conf = topConfidence(step)

  return (
    <button
      type="button"
      className={`step-card ${outcome}${selected ? ' selected' : ''}${step.mustAsk ? ' must-ask-step' : ''}`}
      onClick={onSelect}
      data-step={step.id}
      data-outcome={outcome}
      data-confidence={conf.toFixed(2)}
    >
      <div className="step-head">
        <span className="step-num">S{step.id}</span>
        <span className={`outcome-pill ${outcome}`}>
          {outcome === 'accept' ? 'accept' : 'defer → LLM'}
        </span>
        <span className="step-conf">{conf.toFixed(2)}</span>
      </div>
      <p className="step-state">{step.state}</p>
      {step.mustAsk && <span className="must-ask-tag">must-ask</span>}
      {selected && <ProbBars step={step} />}
    </button>
  )
}

export function Timeline({ episode, tau, selectedId, onSelect }: Props) {
  return (
    <section className="timeline" aria-label="Agent decision timeline">
      <header className="panel-header">
        <h2>Agent timeline</h2>
        <p className="panel-sub">{episode.task}</p>
      </header>
      <p className="episode-context">{episode.context}</p>
      <div className="step-list">
        {episode.steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            tau={tau}
            selected={step.id === selectedId}
            onSelect={() => onSelect(step.id)}
          />
        ))}
      </div>
    </section>
  )
}
