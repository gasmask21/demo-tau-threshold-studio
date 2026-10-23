import type { Episode, ShadowRun } from '../types'

export async function loadEpisode(): Promise<Episode> {
  const res = await fetch('/fixtures/episode.json')
  if (!res.ok) throw new Error(`Failed to load episode: ${res.status}`)
  return res.json() as Promise<Episode>
}

export async function loadShadowRuns(): Promise<ShadowRun[]> {
  const paths = [
    '/fixtures/shadow-run-1.json',
    '/fixtures/shadow-run-2.json',
    '/fixtures/shadow-run-3.json',
  ]
  const runs = await Promise.all(
    paths.map(async (p) => {
      const res = await fetch(p)
      if (!res.ok) throw new Error(`Failed to load ${p}: ${res.status}`)
      return res.json() as Promise<ShadowRun>
    }),
  )
  return runs
}
