import type { AgentDefinition } from '@/lib/agents/types'
import { parseJsonOutput } from '@/lib/agents/parseJsonOutput'
import {
  SEO_SPECIALIST_ROLE_INSTRUCTIONS, buildSeoSpecialistUserPrompt,
  type SeoSpecialistInput, type SeoSpecialistOutput,
} from '@/lib/prompts/specialists/seo-specialist.prompts'

export const seoSpecialistAgent: AgentDefinition<SeoSpecialistInput, SeoSpecialistOutput> = {
  id: 'seo-specialist',
  displayName: 'SEO Specialist',
  modelTier: 'fast',
  maxTokens: 400,
  roleInstructions: SEO_SPECIALIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildSeoSpecialistUserPrompt(input),
  parseOutput: parseJsonOutput<SeoSpecialistOutput>,
}
