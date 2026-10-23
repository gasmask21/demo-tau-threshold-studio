import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { FitResult } from '../lib/threshold'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Props = {
  fit: FitResult | null
  tau: number
}

export function ShadowFitChart({ fit, tau }: Props) {
  if (!fit) {
    return (
      <section className="shadow-chart empty" aria-label="Shadow fit chart">
        <header className="panel-header">
          <h2>Shadow-mode fit</h2>
          <p className="panel-sub">
            Load 3 canned shadow trajectories to plot confidence bins vs advantage
          </p>
        </header>
        <p className="chart-placeholder">
          Press <strong>Fit from shadow runs</strong> to draw the paper-style line.
        </p>
      </section>
    )
  }

  const labels = fit.bins.map((b) => `${b.confLo.toFixed(2)}–${b.confHi.toFixed(2)}`)
  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: 'Mean advantage',
        data: fit.bins.map((b) => b.meanAdvantage),
        backgroundColor: fit.bins.map((b) =>
          b.meanAdvantage >= 0 ? 'rgba(200, 245, 66, 0.55)' : 'rgba(232, 140, 74, 0.55)',
        ),
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#c5d4d1', font: { family: 'Instrument Sans' } } },
      tooltip: {
        callbacks: {
          afterLabel: (ctx) => {
            const bin = fit.bins[ctx.dataIndex]
            return bin ? `n=${bin.n}` : ''
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#8aa39e', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      y: {
        ticks: { color: '#8aa39e' },
        grid: { color: 'rgba(255,255,255,0.06)' },
        title: { display: true, text: 'Est. advantage of accepting', color: '#8aa39e' },
      },
    },
  }

  // Annotate fitted τ with a vertical marker via plugin-like overlay in CSS
  const fittedPct =
    ((fit.fittedTau - 0.4) / (1.0 - 0.4)) * 100

  return (
    <section className="shadow-chart" aria-label="Shadow fit chart" data-testid="shadow-chart">
      <header className="panel-header">
        <h2>Shadow-mode fit</h2>
        <p className="panel-sub">
          {fit.nDecisions} decisions · fitted τ = {fit.fittedTau.toFixed(2)} · slider τ ={' '}
          {tau.toFixed(2)}
        </p>
      </header>
      <div className="chart-wrap">
        <Bar data={data} options={options} />
        <div
          className="tau-marker fitted"
          style={{ left: `${Math.min(98, Math.max(2, fittedPct))}%` }}
          title={`Fitted τ=${fit.fittedTau.toFixed(2)}`}
          data-testid="tau-marker-fitted"
        />
        <div
          className="tau-marker slider"
          style={{
            left: `${Math.min(98, Math.max(2, ((tau - 0.4) / 0.6) * 100))}%`,
          }}
          title={`Slider τ=${tau.toFixed(2)}`}
          data-testid="tau-marker-slider"
        />
      </div>
      <p className="chart-caption">
        Green bins: accepting at that confidence is worth it. Amber: defer. Fitted line =
        lowest τ where accepting stays advantageous (demo floor ≥ 0.95).
      </p>
    </section>
  )
}
