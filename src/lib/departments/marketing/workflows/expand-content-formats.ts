import { supabaseAdmin } from '@/lib/supabase/admin'
import type { WorkflowDefinition } from '@/lib/core/orchestrator/types'
import type { WebsiteSpecialistOutput } from '@/lib/departments/marketing/prompts/website-specialist.prompts'
import type { EmailMarketingSpecialistOutput } from '@/lib/departments/marketing/prompts/email-marketing-specialist.prompts'
import type { VideoDirectorOutput } from '@/lib/departments/marketing/prompts/video-director.prompts'

export interface ExpandContentFormatsInput { coreMessage: string }

// Website Specialist, Email Marketing Specialist and Video Director each work independently
// from the same coreMessage brief — unlike create-todays-content's sequential chain, there's
// no real dependency between these three, so all three build their input straight from
// workflowInput rather than each other's output. No approval gate on the fan-out itself;
// finalize inserts one content_items row per specialist so all 3 land in the existing
// /approvals and /content queues — no new review UI needed.
export const expandContentFormatsWorkflow: WorkflowDefinition = {
  id: 'expand-content-formats',
  displayName: 'Expand Content Formats',
  steps: [
    {
      agentId: 'website-specialist',
      buildInput: (_priorOutputs, workflowInput) => ({
        coreMessage: (workflowInput as ExpandContentFormatsInput).coreMessage,
      }),
    },
    {
      agentId: 'email-marketing-specialist',
      buildInput: (_priorOutputs, workflowInput) => ({
        coreMessage: (workflowInput as ExpandContentFormatsInput).coreMessage,
      }),
    },
    {
      agentId: 'video-director',
      buildInput: (_priorOutputs, workflowInput) => ({
        coreMessage: (workflowInput as ExpandContentFormatsInput).coreMessage,
      }),
    },
  ],
  finalize: async ({ runId, brandId, priorOutputs }) => {
    const website = priorOutputs['website-specialist'] as WebsiteSpecialistOutput | undefined
    const email = priorOutputs['email-marketing-specialist'] as EmailMarketingSpecialistOutput | undefined
    const video = priorOutputs['video-director'] as VideoDirectorOutput | undefined

    const rows: { platform: string; content_type: string; payload: Record<string, unknown> }[] = []
    if (website) rows.push({ platform: 'website', content_type: 'landing_page', payload: { 'website-specialist': website } })
    if (email) rows.push({ platform: 'email', content_type: 'email', payload: { 'email-marketing-specialist': email } })
    if (video) rows.push({ platform: 'facebook', content_type: 'video_script', payload: { 'video-director': video } })

    if (rows.length) {
      await supabaseAdmin.from('content_items').insert(
        rows.map((r) => ({
          brand_id: brandId,
          workflow_run_id: runId,
          platform: r.platform,
          content_type: r.content_type,
          status: 'pending_approval',
          payload: r.payload,
        }))
      )
    }
  },
}
