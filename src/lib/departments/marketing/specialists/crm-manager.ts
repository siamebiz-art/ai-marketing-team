import type { AgentDefinition } from '@/lib/core/agents/types'
import { parseJsonOutput } from '@/lib/core/agents/parseJsonOutput'
import {
  CRM_MANAGER_ROLE_INSTRUCTIONS, buildCrmManagerUserPrompt,
  type CrmManagerInput, type CrmManagerOutput,
} from '@/lib/departments/marketing/prompts/crm-manager.prompts'

export const crmManagerAgent: AgentDefinition<CrmManagerInput, CrmManagerOutput> = {
  id: 'crm-manager',
  displayName: 'CRM Manager',
  modelTier: 'fast',
  maxTokens: 500,
  roleInstructions: CRM_MANAGER_ROLE_INSTRUCTIONS,
  buildUserPrompt: () => buildCrmManagerUserPrompt(),
  parseOutput: parseJsonOutput<CrmManagerOutput>,
}
