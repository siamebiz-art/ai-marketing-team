import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  SUPPORT_CATEGORIZER_ROLE_INSTRUCTIONS, buildSupportCategorizerUserPrompt,
  type SupportCategorizerInput, type SupportCategorizerOutput,
} from '@/lib/departments/support/prompts/support-categorizer.prompts'

export const supportCategorizerAgent: AgentDefinition<SupportCategorizerInput, SupportCategorizerOutput> = {
  id: 'support-categorizer',
  displayName: 'Support Categorizer',
  modelTier: 'fast',
  maxTokens: 300,
  roleInstructions: SUPPORT_CATEGORIZER_ROLE_INSTRUCTIONS,
  buildUserPrompt: (input) => buildSupportCategorizerUserPrompt(input),
  parseOutput: parseJsonOutput<SupportCategorizerOutput>,
}
