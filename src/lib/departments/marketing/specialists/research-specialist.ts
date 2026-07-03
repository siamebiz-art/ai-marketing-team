import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  RESEARCH_SPECIALIST_ROLE_INSTRUCTIONS, buildResearchSpecialistUserPrompt,
  type ResearchSpecialistInput, type ResearchSpecialistOutput,
} from '@/lib/departments/marketing/prompts/research-specialist.prompts'

export const researchSpecialistAgent: AgentDefinition<ResearchSpecialistInput, ResearchSpecialistOutput> = {
  id: 'research-specialist',
  displayName: 'Research Specialist',
  modelTier: 'capable',
  maxTokens: 1200,
  roleInstructions: RESEARCH_SPECIALIST_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildResearchSpecialistUserPrompt(input),
  parseOutput: parseJsonOutput<ResearchSpecialistOutput>,
}
