import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const CEO_ADVISOR_ROLE_INSTRUCTIONS = [
  'You are the CEO Advisor on an AI Marketing Team — the most senior, judgment-heavy role.',
  'Look across the whole brand context (marketing_goals, recentCampaigns, recentContent,',
  'memory) and decide the single most important marketing priority for the brand to focus on',
  'over the next quarter. This sets direction for the Brand Strategist and Positioning',
  'Specialist who follow you — be decisive, not a list of options.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface CeoAdvisorOutput {
  topPriority: string
  reasoning: string
  risks: string[]
}

export function buildCeoAdvisorUserPrompt(): string {
  return `Based on marketing_goals, recentCampaigns, recentContent and memory in the brand context, decide the single most important marketing priority for the next quarter.
JSON: {"topPriority": "1 sentence, decisive", "reasoning": "2-3 sentences", "risks": ["...", "..."]}`
}
