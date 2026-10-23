import type { EpisodeStep } from '../types'

type Props = {
  step: EpisodeStep
}

export function ProbBars({ step }: Props) {
  const max = Math.max(...step.topTools.map((t) => t.p), 0.01)
  return (
    <div className="prob-bars" aria-label="State to tool probability map">
      {step.topTools.map((t) => (
        <div key={t.tool + t.args} className="prob-row">
          <div className="prob-label">
            <code>{t.tool}</code>
            <span className="prob-args">{t.args}</span>
          </div>
          <div className="prob-track">
            <div
              className={`prob-fill${step.mustAsk ? ' must-ask' : ''}`}
              style={{ width: `${(t.p / max) * 100}%` }}
            />
            <span className="prob-val">{t.p.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
