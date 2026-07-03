import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  COMPETITOR_ANALYST_ROLE_INSTRUCTIONS, buildCompetitorAnalystUserPrompt,
  type CompetitorAnalystInput, type CompetitorAnalystOutput,
} from '@/lib/departments/marketing/prompts/competitor-analyst.prompts'

export const competitorAnalystAgent: AgentDefinition<CompetitorAnalystInput, CompetitorAnalystOutput> = {
  id: 'competitor-analyst',
  displayName: 'Competitor Analyst',
  modelTier: 'capable',
  maxTokens: 1000,
  roleInstructions: COMPETITOR_ANALYST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildCompetitorAnalystUserPrompt(input),
  parseOutput: parseJsonOutput<CompetitorAnalystOutput>,
}
