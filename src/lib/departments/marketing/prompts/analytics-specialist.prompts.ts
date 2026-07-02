import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const ANALYTICS_SPECIALIST_ROLE_INSTRUCTIONS = [
  'You are the Analytics Specialist on an AI Marketing Team. Look at recentContent and',
  'recentCampaigns in the brand context and recommend the single most important thing to do',
  'differently or double down on for the next 7 days.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface AnalyticsSpecialistInput { todayLabel: string }
export interface AnalyticsSpecialistOutput { tip: string; weeklyContentCount: number }

export function buildAnalyticsSpecialistUserPrompt(input: AnalyticsSpecialistInput): string {
  return `Today: ${input.todayLabel}
Based on recentContent and recentCampaigns in the brand context, give one concise, actionable tip for the next 7 days, and count how many recentContent items look like they were created in roughly the last 7 days.
JSON: {"tip": "1 sentence", "weeklyContentCount": 0}`
}
