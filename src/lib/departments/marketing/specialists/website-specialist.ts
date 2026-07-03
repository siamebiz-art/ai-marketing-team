import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  WEBSITE_SPECIALIST_ROLE_INSTRUCTIONS, buildWebsiteSpecialistUserPrompt,
  type WebsiteSpecialistInput, type WebsiteSpecialistOutput,
} from '@/lib/departments/marketing/prompts/website-specialist.prompts'

export const websiteSpecialistAgent: AgentDefinition<WebsiteSpecialistInput, WebsiteSpecialistOutput> = {
  id: 'website-specialist',
  displayName: 'Website Specialist',
  modelTier: 'capable',
  maxTokens: 2000,
  roleInstructions: WEBSITE_SPECIALIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildWebsiteSpecialistUserPrompt(input),
  parseOutput: parseJsonOutput<WebsiteSpecialistOutput>,
}
