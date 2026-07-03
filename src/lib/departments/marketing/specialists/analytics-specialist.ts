import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  ANALYTICS_SPECIALIST_ROLE_INSTRUCTIONS, buildAnalyticsSpecialistUserPrompt,
  type AnalyticsSpecialistInput, type AnalyticsSpecialistOutput,
} from '@/lib/departments/marketing/prompts/analytics-specialist.prompts'

export const analyticsSpecialistAgent: AgentDefinition<AnalyticsSpecialistInput, AnalyticsSpecialistOutput> = {
  id: 'analytics-specialist',
  displayName: 'Analytics Specialist',
  modelTier: 'fast',
  maxTokens: 1200,
  roleInstructions: ANALYTICS_SPECIALIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildAnalyticsSpecialistUserPrompt(input),
  parseOutput: parseJsonOutput<AnalyticsSpecialistOutput>,
}
