// This file defines scenario-mode TypeScript types.
// Additional holiday modes and business-rule metadata can be added later.
export type ScenarioMode = 'standard' | 'birthday' | 'christmas' | 'custom'

export interface ScenarioSettings {
  mode: ScenarioMode
  label: string
  description: string
}
