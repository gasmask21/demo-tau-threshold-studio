import type { HarnessMode } from '../types'

const MODES: { id: HarnessMode; blurb: string }[] = [
  {
    id: 'Cascade',
    blurb:
      'Accept the decision model only when confidence ≥ fitted τ; otherwise defer to the LLM. The paper’s default harness.',
  },
  {
    id: 'Replace',
    blurb:
      'Always use the small decision model (τ = 0). Fast and cheap — but burns success without a threshold (−19.0 pts with full handover).',
  },
  {
    id: 'Assist',
    blurb:
      'Decision model proposes; LLM remains in the loop for final say. Lower risk, less savings.',
  },
  {
    id: 'Guard',
    blurb:
      'Gate irreversible tools (cancel, refund) behind an extra yes/no check even when confidence is high.',
  },
  {
    id: 'Trigger',
    blurb:
      'Invoke the decision model only on selected choice points (tool / args / stop / reflect), not every token.',
  },
]

type Props = {
  open: boolean
  onClose: () => void
}

export function ExplainDrawer({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`drawer-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`explain-drawer${open ? ' open' : ''}`}
        aria-hidden={!open}
        aria-label="Harness modes explain"
      >
        <header>
          <h2>Harness modes</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <p className="drawer-lede">
          Read-only chrome from JevAgentHarness (paper Fig. 3 framing). This studio focuses on
          Cascade’s fitted threshold.
        </p>
        <ul className="mode-list">
          {MODES.map((m) => (
            <li key={m.id}>
              <strong>{m.id}</strong>
              <p>{m.blurb}</p>
            </li>
          ))}
        </ul>
        <p className="drawer-cite">
          Sources: arXiv 2610.21412 · fixed τ=0.5 lost 21.5 pts · fitted cascades ~14.2% cost cut.
        </p>
      </aside>
    </>
  )
}
