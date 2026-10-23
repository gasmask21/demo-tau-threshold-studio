import type { PresetId } from '../types'
import { PAPER } from '../lib/threshold'

type Props = {
  tau: number
  onTau: (t: number) => void
  preset: PresetId
  onPreset: (p: PresetId, tau: number) => void
  fittedTau: number | null
  onFit: () => void
  fitting: boolean
}

export function TauControls({
  tau,
  onTau,
  preset,
  onPreset,
  fittedTau,
  onFit,
  fitting,
}: Props) {
  return (
    <section className="tau-controls" aria-label="Confidence threshold controls">
      <header className="panel-header">
        <h2>Confidence threshold τ</h2>
        <p className="panel-sub">Accept only when top-tool p ≥ τ</p>
      </header>

      <div className="tau-display" aria-live="polite">
        <span className="tau-symbol">τ</span>
        <span className="tau-value" data-testid="tau-value">
          {tau.toFixed(2)}
        </span>
      </div>

      <label className="slider-label" htmlFor="tau-slider">
        Drag threshold
      </label>
      <input
        id="tau-slider"
        className="tau-slider"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={tau}
        onChange={(e) => onTau(Number(e.target.value))}
        data-testid="tau-slider"
      />
      <div className="slider-ticks">
        <span>0</span>
        <span>0.50</span>
        <span>1.00</span>
      </div>

      <div className="presets" role="group" aria-label="Threshold presets">
        <button
          type="button"
          className={preset === 'fixed05' ? 'active' : ''}
          data-testid="preset-fixed"
          onClick={() => onPreset('fixed05', 0.5)}
        >
          Fixed 0.5
        </button>
        <button
          type="button"
          className={preset === 'fitted' ? 'active' : ''}
          data-testid="preset-fitted"
          onClick={() =>
            onPreset('fitted', fittedTau ?? PAPER.fittedTauRange[0])
          }
        >
          Fitted (~0.99)
        </button>
        <button
          type="button"
          className={preset === 'alwaysReplace' ? 'active' : ''}
          data-testid="preset-replace"
          onClick={() => onPreset('alwaysReplace', 0)}
        >
          Always replace (τ=0)
        </button>
      </div>

      <button
        type="button"
        className="fit-btn"
        data-testid="fit-shadow"
        onClick={onFit}
        disabled={fitting}
      >
        {fitting ? 'Fitting…' : 'Fit from shadow runs'}
      </button>

      {fittedTau !== null && (
        <p className="fitted-line" data-testid="fitted-tau">
          Shadow-fitted τ = <strong>{fittedTau.toFixed(2)}</strong>
          <span className="hint"> (paper range ~0.99–1.00)</span>
        </p>
      )}
    </section>
  )
}
