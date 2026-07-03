import { supabaseAdmin } from '@/lib/supabase/admin'
import type { WorkflowDefinition } from '@/lib/core/orchestrator/types'
import type { CeoAdvisorOutput } from '@/lib/departments/marketing/prompts/ceo-advisor.prompts'
import type { BrandStrategistOutput } from '@/lib/departments/marketing/prompts/brand-strategist.prompts'
import type { PositioningSpecialistOutput } from '@/lib/departments/marketing/prompts/positioning-specialist.prompts'

// Advisory-only, no approval gate and no content_items row — this workflow's real output is
// brand_memory rows that shape every future agent call for this brand (loadBrandContext already
// injects all brand_memory into every specialist's system prompt), not a publishable draft.
// Not on a daily cadence like create-todays-content — meant to be re-run periodically as the
// brand's direction evolves, triggered manually from /strategy.
export const brandStrategyReviewWorkflow: WorkflowDefinition = {
  id: 'brand-strategy-review',
  displayName: 'Brand Strategy Review',
  steps: [
    {
      agentId: 'ceo-advisor',
      buildInput: () => ({}),
    },
    {
      agentId: 'brand-strategist',
      buildInput: (priorOutputs) => {
        const ceo = priorOutputs['ceo-advisor'] as CeoAdvisorOutput
        return { topPriority: ceo.topPriority, reasoning: ceo.reasoning }
      },
    },
    {
      agentId: 'positioning-specialist',
      buildInput: (priorOutputs) => {
        const strategist = priorOutputs['brand-strategist'] as BrandStrategistOutput
        return { strategicDirection: strategist.strategicDirection, keyMessage: strategist.keyMessage }
      },
    },
  ],
  finalize: async ({ brandId, priorOutputs }) => {
    const ceo = priorOutputs['ceo-advisor'] as CeoAdvisorOutput | undefined
    const strategist = priorOutputs['brand-strategist'] as BrandStrategistOutput | undefined
    const positioning = priorOutputs['positioning-specialist'] as PositioningSpecialistOutput | undefined

    const rows: { summary: string; evidence: Record<string, unknown> }[] = []
    if (ceo) rows.push({ summary: `[CEO Advisor] ${ceo.topPriority} — ${ceo.reasoning}`, evidence: { risks: ceo.risks } })
    if (strategist) rows.push({ summary: `[Brand Strategist] ${strategist.strategicDirection}: ${strategist.keyMessage}`, evidence: { rationale: strategist.rationale } })
    if (positioning) rows.push({ summary: `[Positioning] ${positioning.positioningStatement}`, evidence: { differentiator: positioning.differentiator } })

    if (rows.length) {
      await supabaseAdmin.from('brand_memory').insert(
        rows.map((r) => ({
          brand_id: brandId,
          category: 'strategic_direction',
          summary: r.summary,
          evidence: r.evidence,
          confidence: 'medium',
        }))
      )
    }
  },
}
