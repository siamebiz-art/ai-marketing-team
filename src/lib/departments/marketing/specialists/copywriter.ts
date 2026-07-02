import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  COPYWRITER_ROLE_INSTRUCTIONS, buildCopywriterUserPrompt,
  type CopywriterInput, type CopywriterOutput,
} from '@/lib/departments/marketing/prompts/copywriter.prompts'

export const copywriterAgent: AgentDefinition<CopywriterInput, CopywriterOutput> = {
  id: 'copywriter',
  displayName: 'Copywriter',
  modelTier: 'capable',
  maxTokens: 1200,
  roleInstructions: COPYWRITER_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildCopywriterUserPrompt(input),
  parseOutput: parseJsonOutput<CopywriterOutput>,
}
