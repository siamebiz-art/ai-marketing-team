import { supabaseAdmin } from '@/lib/supabase/admin'
import { AGENT_REGISTRY } from '@/lib/core/agents/registry'
import { runAgent } from '@/lib/core/agents/runAgent'
import type { BrandContext } from '@/lib/core/brand-context/types'
import type { WorkflowDefinition } from './types'

interface ExecuteParams {
  runId: string
  brandId: string
  workflow: WorkflowDefinition
  context: BrandContext
  workflowInput: unknown
  priorOutputs: Record<string, unknown>
  startIndex: number
}

// Shared by runWorkflow (fresh start) and approveWorkflowStep (resume) — the only place
// that walks a WorkflowDefinition's steps, so both entry points stay in sync. Nothing here
// is department-specific — confirmed by department #2 (AI Support Team) reusing this
// unchanged.
export async function executeSteps(
  { runId, brandId, workflow, context, workflowInput, priorOutputs, startIndex }: ExecuteParams
): Promise<{ status: 'awaiting_approval' | 'completed' }> {
  for (let i = startIndex; i < workflow.steps.length; i++) {
    const step = workflow.steps[i]
    const agentDef = AGENT_REGISTRY[step.agentId]
    if (!agentDef) throw new Error(`Unknown agent id "${step.agentId}" in workflow "${workflow.id}"`)

    const agentInput = step.buildInput(priorOutputs, workflowInput)

    const { data: stepRow, error: insertError } = await supabaseAdmin
      .from('workflow_run_steps')
      .insert({ workflow_run_id: runId, agent_id: step.agentId, status: 'running', input: agentInput })
      .select('id')
      .single()
    if (insertError || !stepRow) throw new Error(`Failed to log step "${step.agentId}": ${insertError?.message}`)

    try {
      const result = await runAgent(agentDef, agentInput, context, priorOutputs)
      priorOutputs[step.agentId] = result.output

      await supabaseAdmin.from('workflow_run_steps').update({
        status: 'completed',
        output: result.output,
        usage: {
          input_tokens: result.usage.inputTokens,
          output_tokens: result.usage.outputTokens,
          cache_read_input_tokens: result.usage.cacheReadInputTokens,
          cache_creation_input_tokens: result.usage.cacheCreationInputTokens,
        },
        completed_at: new Date().toISOString(),
      }).eq('id', stepRow.id)

      await supabaseAdmin.from('workflow_runs').update({
        outputs: priorOutputs, updated_at: new Date().toISOString(),
      }).eq('id', runId)

      if (step.requiresApproval) {
        await supabaseAdmin.from('workflow_runs').update({ status: 'awaiting_approval' }).eq('id', runId)
        return { status: 'awaiting_approval' }
      }
    } catch (e) {
      const message = (e as Error).message
      await supabaseAdmin.from('workflow_run_steps').update({
        status: 'failed', error: message, completed_at: new Date().toISOString(),
      }).eq('id', stepRow.id)
      await supabaseAdmin.from('workflow_runs').update({
        status: 'failed', error: message, updated_at: new Date().toISOString(),
      }).eq('id', runId)
      throw e
    }
  }

  // What "done" means is entirely up to the workflow (a marketing workflow writes a
  // content_items row; a future Sales/Support workflow would write somewhere else, or
  // nothing at all) — the orchestrator itself has no opinion.
  await workflow.finalize?.({ runId, brandId, priorOutputs, workflowInput })

  await supabaseAdmin.from('workflow_runs').update({
    status: 'completed', updated_at: new Date().toISOString(),
  }).eq('id', runId)
  return { status: 'completed' }
}
