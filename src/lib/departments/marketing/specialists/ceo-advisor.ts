import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  CEO_ADVISOR_ROLE_INSTRUCTIONS, buildCeoAdvisorUserPrompt,
  type CeoAdvisorOutput,
} from '@/lib/departments/marketing/prompts/ceo-advisor.prompts'

// Takes no meaningful input — reviews the whole brand context, not a specific brief. The one
// role in this project that warrants the `premium` tier (matches MODEL_BY_TIER's own framing
// of premium as reserved for judgment-heavy roles).
export const ceoAdvisorAgent: AgentDefinition<Record<string, never>, CeoAdvisorOutput> = {
  id: 'ceo-advisor',
  displayName: 'CEO Advisor',
  modelTier: 'premium',
  maxTokens: 1600,
  roleInstructions: CEO_ADVISOR_ROLE_INSTRUCTIONS,
  buildUserPrompt: () => buildCeoAdvisorUserPrompt(),
  parseOutput: parseJsonOutput<CeoAdvisorOutput>,
}
