// This file contains simple scenario rule placeholders.
// It should later map scenario modes to the business logic used across the application.
import type { ScenarioSettings } from '~/types/scenario'

export const scenarioRules: ScenarioSettings[] = [
  {
    mode: 'standard',
    label: 'Standard',
    description: 'Default wishlist behavior for general celebrations.'
  },
  {
    mode: 'birthday',
    label: 'Birthday',
    description: 'Placeholder scenario for birthday-specific rules.'
  }
]
