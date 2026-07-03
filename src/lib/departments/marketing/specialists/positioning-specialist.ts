import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  POSITIONING_SPECIALIST_ROLE_INSTRUCTIONS, buildPositioningSpecialistUserPrompt,
  type PositioningSpecialistInput, type PositioningSpecialistOutput,
} from '@/lib/departments/marketing/prompts/positioning-specialist.prompts'

export const positioningSpecialistAgent: AgentDefinition<PositioningSpecialistInput, PositioningSpecialistOutput> = {
  id: 'positioning-specialist',
  displayName: 'Positioning Specialist',
  modelTier: 'capable',
  maxTokens: 500,
  roleInstructions: POSITIONING_SPECIALIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildPositioningSpecialistUserPrompt(input),
  parseOutput: parseJsonOutput<PositioningSpecialistOutput>,
}
