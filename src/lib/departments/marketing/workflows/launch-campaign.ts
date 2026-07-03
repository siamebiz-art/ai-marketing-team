import { supabaseAdmin } from '@/lib/supabase/admin'
import type { WorkflowDefinition } from '@/lib/core/orchestrator/types'
import type { ResearchSpecialistOutput } from '@/lib/departments/marketing/prompts/research-specialist.prompts'
import type { CampaignPlannerOutput } from '@/lib/departments/marketing/prompts/campaign-planner.prompts'
import type { ContentStrategistOutput } from '@/lib/departments/marketing/prompts/content-strategist.prompts'
import type { CopywriterOutput } from '@/lib/departments/marketing/prompts/copywriter.prompts'

export interface LaunchCampaignInput { goal: string }

// Deliberately thin: 2 new specialists (Research, Campaign Planner) reused alongside 3
// existing ones (Content Strategist, Copywriter, Creative Director), not the full 12-role
// flagship pipeline from the original spec. The existing daily Strategy Agent doesn't fit
// here — "today's angle" is a different question from "this campaign's angle" — so Campaign
// Planner determines the campaign's strategic angle itself instead of misusing Strategy's
// narrow, date-framed input shape. Activates the `campaigns` table, empty since the schema
// was created.
export const launchCampaignWorkflow: WorkflowDefinition = {
  id: 'launch-campaign',
  displayName: 'Launch Campaign',
  steps: [
    {
      agentId: 'research-specialist',
      buildInput: (_priorOutputs, workflowInput) => ({
        goal: (workflowInput as LaunchCampaignInput).goal,
      }),
    },
    {
      agentId: 'campaign-planner',
      buildInput: (priorOutputs, workflowInput) => {
        const research = priorOutputs['research-specialist'] as ResearchSpecialistOutput
        return {
          goal: (workflowInput as LaunchCampaignInput).goal,
          competitiveSnapshot: research.competitiveSnapshot,
          audienceInsight: research.audienceInsight,
        }
      },
    },
    {
      agentId: 'content-strategist',
      buildInput: (priorOutputs) => ({
        strategyInsight: (priorOutputs['campaign-planner'] as CampaignPlannerOutput).strategicAngle,
      }),
    },
    {
      agentId: 'copywriter',
      buildInput: (priorOutputs) => {
        const plan = priorOutputs['campaign-planner'] as CampaignPlannerOutput
        const contentStrategy = priorOutputs['content-strategist'] as ContentStrategistOutput
        return {
          strategyInsight: plan.strategicAngle,
          platform: contentStrategy.platform,
          contentType: contentStrategy.contentType,
          templateType: contentStrategy.templateType,
        }
      },
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
  ],
  finalize: async ({ runId, brandId, priorOutputs, workflowInput }) => {
    const plan = priorOutputs['campaign-planner'] as CampaignPlannerOutput | undefined
    const contentStrategy = priorOutputs['content-strategist'] as { platform?: string; contentType?: string } | undefined
    const goal = (workflowInput as LaunchCampaignInput).goal

    const { data: campaign } = await supabaseAdmin.from('campaigns').insert({
      brand_id: brandId,
      name: plan?.objective ?? goal,
      goal,
      status: 'active',
      summary: { strategicAngle: plan?.strategicAngle, timeline: plan?.timeline, primaryChannel: plan?.primaryChannel, contentPlan: plan?.contentPlan },
    }).select('id').single()

    await supabaseAdmin.from('content_items').insert({
      brand_id: brandId,
      campaign_id: campaign?.id ?? null,
      workflow_run_id: runId,
      platform: (contentStrategy?.platform ?? 'facebook').toString().toLowerCase(),
      content_type: contentStrategy?.contentType ?? 'post',
      status: 'pending_approval',
      payload: priorOutputs,
    })
  },
}
