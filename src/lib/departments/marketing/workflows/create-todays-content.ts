import { supabaseAdmin } from '@/lib/supabase/admin'
import type { WorkflowDefinition } from '@/lib/core/orchestrator/types'
import type { StrategyOutput } from '@/lib/departments/marketing/prompts/strategy.prompts'
import type { ContentStrategistOutput } from '@/lib/departments/marketing/prompts/content-strategist.prompts'
import type { CopywriterOutput } from '@/lib/departments/marketing/prompts/copywriter.prompts'

// Deliberately embedded here, not in the brand-context block — "today" must stay in the
// per-call user prompt (after the cache breakpoint) so the shared brand-context system
// block stays byte-identical, and cacheable, across every step of a run.
function todayLabel(): string {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Bangkok',
  })
}

export const createTodaysContentWorkflow: WorkflowDefinition = {
  id: 'create-todays-content',
  displayName: "Create Today's Content",
  steps: [
    {
      agentId: 'strategy',
      buildInput: () => ({ todayLabel: todayLabel() }),
    },
    {
      agentId: 'content-strategist',
      buildInput: (priorOutputs) => ({
        strategyInsight: (priorOutputs.strategy as StrategyOutput).insight,
      }),
    },
    {
      agentId: 'copywriter',
      buildInput: (priorOutputs) => {
        const strategy = priorOutputs.strategy as StrategyOutput
        const contentStrategy = priorOutputs['content-strategist'] as ContentStrategistOutput
        return {
          strategyInsight: strategy.insight,
          platform: contentStrategy.platform,
          contentType: contentStrategy.contentType,
          templateType: contentStrategy.templateType,
        }
      },
      // Mirrors Toonetic's approval-queue spirit without building queue UI — a workflow_run
      // pauses here until approveWorkflowStep(runId) is called.
      requiresApproval: true,
    },
    {
      agentId: 'creative-director',
      buildInput: (priorOutputs) => {
        const copy = priorOutputs.copywriter as CopywriterOutput
        const contentStrategy = priorOutputs['content-strategist'] as ContentStrategistOutput
        return {
          displayText: copy.displayText,
          caption: copy.caption,
          keyPoints: copy.keyPoints,
          templateType: contentStrategy.templateType,
        }
      },
    },
    {
      agentId: 'analytics-specialist',
      buildInput: () => ({ todayLabel: todayLabel() }),
    },
    {
      agentId: 'seo-specialist',
      buildInput: (priorOutputs) => {
        const copy = priorOutputs.copywriter as CopywriterOutput
        const contentStrategy = priorOutputs['content-strategist'] as ContentStrategistOutput
        return { caption: copy.caption, platform: contentStrategy.platform }
      },
    },
  ],
  // Marketing-specific "done" behavior lives here, not in the generic orchestrator — a
  // future Sales/Support/Research workflow would finalize into a different table entirely.
  finalize: async ({ runId, brandId, priorOutputs }) => {
    const contentStrategy = priorOutputs['content-strategist'] as { platform?: string; contentType?: string } | undefined
    await supabaseAdmin.from('content_items').insert({
      brand_id: brandId,
      workflow_run_id: runId,
      platform: (contentStrategy?.platform ?? 'facebook').toString().toLowerCase(),
      content_type: contentStrategy?.contentType ?? 'post',
      status: 'pending_approval',
      payload: priorOutputs,
    })
  },
}
