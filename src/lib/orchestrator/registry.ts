import type { WorkflowDefinition } from './types'
import { createTodaysContentWorkflow } from './workflows/create-todays-content'

// Adding workflow #2 (e.g. "launch-campaign") is additive — one new file under workflows/,
// one line here. Nothing else in the orchestrator changes.
export const WORKFLOW_REGISTRY: Record<string, WorkflowDefinition> = {
  [createTodaysContentWorkflow.id]: createTodaysContentWorkflow,
}
