import type { WorkflowDefinition } from './types'
import { createTodaysContentWorkflow } from './workflows/create-todays-content'
import { answerSupportTicketWorkflow } from './workflows/answer-support-ticket'

// Adding workflow #2 (e.g. "launch-campaign") is additive — one new file under workflows/,
// one line here. Nothing else in the orchestrator changes. answerSupportTicketWorkflow below
// is proof: a second department's workflow, registered the same way as marketing's.
export const WORKFLOW_REGISTRY: Record<string, WorkflowDefinition> = {
  [createTodaysContentWorkflow.id]: createTodaysContentWorkflow,
  [answerSupportTicketWorkflow.id]: answerSupportTicketWorkflow,
}
