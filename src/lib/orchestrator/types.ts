export interface WorkflowStep {
  agentId: string
  buildInput: (priorOutputs: Record<string, unknown>, workflowInput: unknown) => unknown
  requiresApproval?: boolean
}

export interface WorkflowFinalizeParams {
  runId: string
  brandId: string
  priorOutputs: Record<string, unknown>
  // Surfaced here (not just to buildInput) because building department #2 (AI Support Team)
  // showed a real need: the original ticket question lives only in workflowInput, not in any
  // agent's output, so finalize needs it to store the real question rather than an AI summary.
  workflowInput: unknown
}

export interface WorkflowDefinition {
  id: string
  displayName: string
  steps: WorkflowStep[]
  // What happens when every step finishes — e.g. writing a content_items row for a marketing
  // workflow. Owned by the workflow, not the orchestrator: a Sales/Support/Research workflow
  // would finalize into a completely different table, and the orchestrator shouldn't need to
  // know which. Optional — a workflow with no side effect to persist can omit it.
  finalize?: (params: WorkflowFinalizeParams) => Promise<void>
}
