import type { AgentDefinition } from '@/lib/agents/types'
import { parseJsonOutput } from '@/lib/agents/parseJsonOutput'
import {
  CREATIVE_DIRECTOR_ROLE_INSTRUCTIONS, buildCreativeDirectorUserPrompt,
  type CreativeDirectorInput, type CreativeDirectorOutput,
} from '@/lib/prompts/specialists/creative-director.prompts'

export const creativeDirectorAgent: AgentDefinition<CreativeDirectorInput, CreativeDirectorOutput> = {
  id: 'creative-director',
  displayName: 'Creative Director',
  modelTier: 'fast',
  maxTokens: 600,
  roleInstructions: CREATIVE_DIRECTOR_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildCreativeDirectorUserPrompt(input),
  parseOutput: parseJsonOutput<CreativeDirectorOutput>,
}
