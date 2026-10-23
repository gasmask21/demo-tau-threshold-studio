export type ToolProb = {
  tool: string
  args: string
  p: number
}

export type EpisodeStep = {
  id: number
  state: string
  topTools: ToolProb[]
  gold: string
  irreversible: boolean
  mustAsk: boolean
  note: string
}

export type Episode = {
  id: string
  task: string
  customer: string
  context: string
  source: string
  steps: EpisodeStep[]
}

export type ShadowDecision = {
  step: number
  confidence: number
  acceptedWouldSucceed: boolean
  advantage: number
}

export type ShadowRun = {
  id: string
  mode: string
  taskFamily: string
  description: string
  decisions: ShadowDecision[]
}

export type DecisionOutcome = 'accept' | 'defer'

export type PresetId = 'fixed05' | 'fitted' | 'alwaysReplace' | 'custom'

export type HarnessMode = 'Cascade' | 'Replace' | 'Assist' | 'Guard' | 'Trigger'
