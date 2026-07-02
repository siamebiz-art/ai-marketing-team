import type { WorkflowDefinition } from './types'
import { MARKETING_WORKFLOWS } from '@/lib/departments/marketing'
import { SUPPORT_WORKFLOWS } from '@/lib/departments/support'

// Adding department #3's workflows: export them from its own index.ts, add one import +
// one spread entry here. Nothing else in the orchestrator changes.
export const WORKFLOW_REGISTRY: Record<string, WorkflowDefinition> = Object.fromEntries(
  [...MARKETING_WORKFLOWS, ...SUPPORT_WORKFLOWS].map((workflow) => [workflow.id, workflow])
)
