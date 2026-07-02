import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  CREATIVE_DIRECTOR_ROLE_INSTRUCTIONS, buildCreativeDirectorUserPrompt,
  type CreativeDirectorInput, type CreativeDirectorOutput,
} from '@/lib/departments/marketing/prompts/creative-director.prompts'

export const creativeDirectorAgent: AgentDefinition<CreativeDirectorInput, CreativeDirectorOutput> = {
  id: 'creative-director',
  displayName: 'Creative Director',
  modelTier: 'fast',
  maxTokens: 900,
  roleInstructions: CREATIVE_DIRECTOR_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildCreativeDirectorUserPrompt(input),
  parseOutput: parseJsonOutput<CreativeDirectorOutput>,
}
