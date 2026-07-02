import type { AgentDefinition } from '@/lib/agents/types'
import { parseJsonOutput } from '@/lib/agents/parseJsonOutput'
import {
  SUPPORT_WRITER_ROLE_INSTRUCTIONS, buildSupportWriterUserPrompt,
  type SupportWriterInput, type SupportWriterOutput,
} from '@/lib/prompts/specialists/support-writer.prompts'

export const supportWriterAgent: AgentDefinition<SupportWriterInput, SupportWriterOutput> = {
  id: 'support-writer',
  displayName: 'Support Writer',
  modelTier: 'capable',
  maxTokens: 1200,
  roleInstructions: SUPPORT_WRITER_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildSupportWriterUserPrompt(input),
  parseOutput: parseJsonOutput<SupportWriterOutput>,
}
