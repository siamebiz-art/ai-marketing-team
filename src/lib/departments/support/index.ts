import type { AgentDefinition } from '@/lib/core/agents/types'
import type { WorkflowDefinition } from '@/lib/core/orchestrator/types'
import { supportCategorizerAgent } from './specialists/support-categorizer'
import { supportWriterAgent } from './specialists/support-writer'
import { answerSupportTicketWorkflow } from './workflows/answer-support-ticket'

// Department #2 — added without touching core/ at all, proof the platform generalizes.
export const SUPPORT_AGENTS: AgentDefinition[] = [
  supportCategorizerAgent as AgentDefinition,
  supportWriterAgent as AgentDefinition,
]

export const SUPPORT_WORKFLOWS: WorkflowDefinition[] = [
  answerSupportTicketWorkflow,
]
