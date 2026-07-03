import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  EMAIL_MARKETING_SPECIALIST_ROLE_INSTRUCTIONS, buildEmailMarketingSpecialistUserPrompt,
  type EmailMarketingSpecialistInput, type EmailMarketingSpecialistOutput,
} from '@/lib/departments/marketing/prompts/email-marketing-specialist.prompts'

export const emailMarketingSpecialistAgent: AgentDefinition<EmailMarketingSpecialistInput, EmailMarketingSpecialistOutput> = {
  id: 'email-marketing-specialist',
  displayName: 'Email Marketing Specialist',
  modelTier: 'capable',
  maxTokens: 1400,
  roleInstructions: EMAIL_MARKETING_SPECIALIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildEmailMarketingSpecialistUserPrompt(input),
  parseOutput: parseJsonOutput<EmailMarketingSpecialistOutput>,
}
