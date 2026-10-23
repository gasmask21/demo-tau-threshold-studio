import { PAPER } from '../lib/threshold'

type Props = {
  risk: number
  costSaved: number
  tau: number
  acceptCount: number
  deferCount: number
}

export function Meters({ risk, costSaved, tau, acceptCount, deferCount }: Props) {
  const highRisk = risk >= 0.45 || tau <= 0.5
  const lowRiskSavings = risk < 0.2 && tau >= 0.95

  return (
    <section className="meters" aria-label="Risk and savings meters">
      <div className="meter-row">
        <div className="meter">
          <div className="meter-label">
            Success risk
            {highRisk && (
              <span className="badge risk" data-testid="badge-high-risk">
                High risk · −{PAPER.fixedLossPts} pts framing
              </span>
            )}
            {lowRiskSavings && (
              <span className="badge safe" data-testid="badge-low-risk">
                Low risk · ~{PAPER.fittedCostCutPct}% savings
              </span>
            )}
          </div>
          <div className="meter-bar" role="meter" aria-valuenow={Math.round(risk * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`meter-fill risk-fill${highRisk ? ' hot' : ''}`}
              style={{ width: `${Math.round(risk * 100)}%` }}
            />
          </div>
          <span className="meter-pct">{Math.round(risk * 100)}%</span>
        </div>

        <div className="meter">
          <div className="meter-label">Est. cost saved vs LLM-only</div>
          <div className="meter-bar" role="meter" aria-valuenow={costSaved} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="meter-fill save-fill"
              style={{ width: `${Math.min(100, costSaved)}%` }}
            />
          </div>
          <span className="meter-pct" data-testid="cost-saved">
            {costSaved}%
          </span>
        </div>
      </div>

      <div className="accept-defer-counts">
        <span data-testid="accept-count" className="count accept">
          {acceptCount} accept
        </span>
        <span data-testid="defer-count" className="count defer">
          {deferCount} defer
        </span>
      </div>
    </section>
  )
}
