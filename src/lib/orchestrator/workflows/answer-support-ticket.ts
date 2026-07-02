import { supabaseAdmin } from '@/lib/supabase/admin'
import type { WorkflowDefinition } from '../types'
import type { SupportCategorizerOutput } from '@/lib/prompts/specialists/support-categorizer.prompts'

export interface AnswerSupportTicketInput { question: string }

// Department #2 (AI Support Team) — proves the orchestrator/agent framework generalizes:
// this workflow reuses the exact same WorkflowDefinition/WorkflowStep shape, the same
// loadMarketingBrain/MarketingBrainContext (product info + brand voice are just as relevant
// to a support reply as to an ad), and the same approval-gate mechanism as the marketing
// workflow — nothing in the orchestrator core changed to support this.
export const answerSupportTicketWorkflow: WorkflowDefinition = {
  id: 'answer-support-ticket',
  displayName: 'Answer Support Ticket',
  steps: [
    {
      agentId: 'support-categorizer',
      buildInput: (_priorOutputs, workflowInput) => ({
        question: (workflowInput as AnswerSupportTicketInput).question,
      }),
    },
    {
      agentId: 'support-writer',
      buildInput: (priorOutputs, workflowInput) => {
        const categorized = priorOutputs['support-categorizer'] as SupportCategorizerOutput
        return {
          question: (workflowInput as AnswerSupportTicketInput).question,
          category: categorized.category,
          urgency: categorized.urgency,
        }
      },
      // A draft reply to a real customer should be reviewed before sending — same approval
      // pattern as the marketing workflow, applied to a completely different domain.
      requiresApproval: true,
    },
  ],
  finalize: async ({ runId, brandId, priorOutputs, workflowInput }) => {
    const categorized = priorOutputs['support-categorizer'] as SupportCategorizerOutput | undefined
    const written = priorOutputs['support-writer'] as { draftReply?: string } | undefined
    await supabaseAdmin.from('support_tickets').insert({
      brand_id: brandId,
      workflow_run_id: runId,
      question: (workflowInput as AnswerSupportTicketInput).question,
      category: categorized?.category ?? 'general',
      urgency: categorized?.urgency ?? 'low',
      draft_reply: written?.draftReply ?? '',
      status: 'pending_review',
    })
  },
}
