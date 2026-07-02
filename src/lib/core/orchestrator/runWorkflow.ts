import { supabaseAdmin } from '@/lib/supabase/admin'
import { loadBrandContext } from '@/lib/core/brand-context/loadBrandContext'
import { WORKFLOW_REGISTRY } from './registry'
import { executeSteps } from './executeSteps'

export async function runWorkflow(brandSlug: string, workflowId: string, input: unknown = {}) {
  const workflow = WORKFLOW_REGISTRY[workflowId]
  if (!workflow) throw new Error(`Unknown workflow id "${workflowId}"`)

  const context = await loadBrandContext(brandSlug)

  const { data: runRow, error } = await supabaseAdmin
    .from('workflow_runs')
    .insert({ brand_id: context.brand.id, workflow_id: workflowId, status: 'running', input })
    .select('id')
    .single()
  if (error || !runRow) throw new Error(`Failed to create workflow run: ${error?.message}`)

  await executeSteps({
    runId: runRow.id,
    brandId: context.brand.id,
    workflow,
    context,
    workflowInput: input,
    priorOutputs: {},
    startIndex: 0,
  })

  return getWorkflowRun(runRow.id)
}

export async function getWorkflowRun(runId: string) {
  const { data, error } = await supabaseAdmin.from('workflow_runs').select('*').eq('id', runId).single()
  if (error || !data) throw new Error(`Workflow run not found: ${error?.message}`)
  return data
}

export async function getWorkflowRunSteps(runId: string) {
  const { data, error } = await supabaseAdmin
    .from('workflow_run_steps')
    .select('*')
    .eq('workflow_run_id', runId)
    .order('started_at', { ascending: true })
  if (error) throw new Error(`Failed to load workflow run steps: ${error.message}`)
  return data ?? []
}
