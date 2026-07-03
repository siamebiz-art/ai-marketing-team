import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  GROWTH_HACKER_ROLE_INSTRUCTIONS, buildGrowthHackerUserPrompt,
  type GrowthHackerInput, type GrowthHackerOutput,
} from '@/lib/departments/marketing/prompts/growth-hacker.prompts'

export const growthHackerAgent: AgentDefinition<GrowthHackerInput, GrowthHackerOutput> = {
  id: 'growth-hacker',
  displayName: 'Growth Hacker',
  modelTier: 'capable',
  maxTokens: 1200,
  roleInstructions: GROWTH_HACKER_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildGrowthHackerUserPrompt(input),
  parseOutput: parseJsonOutput<GrowthHackerOutput>,
}
