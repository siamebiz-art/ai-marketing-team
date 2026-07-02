import { supabaseAdmin } from '@/lib/supabase/admin'
import { loadMarketingBrain } from '@/lib/marketing-brain/loadMarketingBrain'
import { WORKFLOW_REGISTRY } from './registry'
import { executeSteps } from './executeSteps'
import { getWorkflowRun } from './runWorkflow'

export async function approveWorkflowStep(runId: string) {
  const { data: run, error } = await supabaseAdmin.from('workflow_runs').select('*').eq('id', runId).single()
  if (error || !run) throw new Error(`Workflow run not found: ${error?.message}`)
  if (run.status !== 'awaiting_approval') {
    throw new Error(`Workflow run ${runId} is not awaiting approval (status: ${run.status})`)
  }

  const workflow = WORKFLOW_REGISTRY[run.workflow_id]
  if (!workflow) throw new Error(`Unknown workflow id "${run.workflow_id}"`)

  const { data: brandRow, error: brandError } = await supabaseAdmin
    .from('brands').select('slug').eq('id', run.brand_id).single()
  if (brandError || !brandRow) throw new Error(`Brand not found for run ${runId}: ${brandError?.message}`)

  const brain = await loadMarketingBrain(brandRow.slug)

  // Resume from the next step after however many have completed so far — avoids needing
  // a separate "current step index" column; workflow_run_steps is the source of truth.
  const { count } = await supabaseAdmin
    .from('workflow_run_steps')
    .select('id', { count: 'exact', head: true })
    .eq('workflow_run_id', runId)
    .eq('status', 'completed')

  await supabaseAdmin.from('workflow_runs').update({ status: 'running' }).eq('id', runId)

  await executeSteps({
    runId,
    brandId: run.brand_id,
    workflow,
    brain,
    workflowInput: run.input,
    priorOutputs: (run.outputs as Record<string, unknown>) ?? {},
    startIndex: count ?? 0,
  })

  return getWorkflowRun(runId)
}
