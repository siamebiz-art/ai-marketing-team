import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const CAMPAIGN_PLANNER_ROLE_INSTRUCTIONS = [
  'You are the Campaign Planner on an AI Marketing Team. Given a campaign goal and the Research',
  'Specialist\'s brief, determine the strategic angle for this campaign (using brand context:',
  'brandVoice, marketingGoals, memory) and produce a campaign plan: objective, primary channel,',
  'a rough timeline, and a short content plan (a few concrete content ideas to produce).',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface CampaignPlannerInput {
  goal: string
  competitiveSnapshot: string
  audienceInsight: string
}
export interface CampaignPlannerOutput {
  strategicAngle: string
  objective: string
  primaryChannel: string
  timeline: string
  contentPlan: string[]
}

export function buildCampaignPlannerUserPrompt(input: CampaignPlannerInput): string {
  return `Campaign goal: "${input.goal}"
Competitive snapshot: "${input.competitiveSnapshot}"
Audience insight: "${input.audienceInsight}"

Determine the strategic angle for this campaign, then produce the campaign plan.
JSON: {"strategicAngle": "1-2 sentences", "objective": "1 sentence, specific and measurable where possible", "primaryChannel": "Facebook|TikTok|Instagram|LINE", "timeline": "e.g. 2 weeks, 3 posts", "contentPlan": ["idea 1", "idea 2", "idea 3"]}`
}
