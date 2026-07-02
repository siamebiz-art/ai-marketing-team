import type { AgentDefinition } from '@/lib/agents/types'
import { parseJsonOutput } from '@/lib/agents/parseJsonOutput'
import {
  ANALYTICS_SPECIALIST_ROLE_INSTRUCTIONS, buildAnalyticsSpecialistUserPrompt,
  type AnalyticsSpecialistInput, type AnalyticsSpecialistOutput,
} from '@/lib/prompts/specialists/analytics-specialist.prompts'

export const analyticsSpecialistAgent: AgentDefinition<AnalyticsSpecialistInput, AnalyticsSpecialistOutput> = {
  id: 'analytics-specialist',
  displayName: 'Analytics Specialist',
  modelTier: 'fast',
  maxTokens: 500,
  roleInstructions: ANALYTICS_SPECIALIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildAnalyticsSpecialistUserPrompt(input),
  parseOutput: parseJsonOutput<AnalyticsSpecialistOutput>,
}
