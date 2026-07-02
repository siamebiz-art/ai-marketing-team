import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  SUPPORT_WRITER_ROLE_INSTRUCTIONS, buildSupportWriterUserPrompt,
  type SupportWriterInput, type SupportWriterOutput,
} from '@/lib/departments/support/prompts/support-writer.prompts'

export const supportWriterAgent: AgentDefinition<SupportWriterInput, SupportWriterOutput> = {
  id: 'support-writer',
  displayName: 'Support Writer',
  modelTier: 'capable',
  maxTokens: 1200,
  roleInstructions: SUPPORT_WRITER_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildSupportWriterUserPrompt(input),
  parseOutput: parseJsonOutput<SupportWriterOutput>,
}
