import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const CRM_MANAGER_ROLE_INSTRUCTIONS = [
  'You are the CRM Manager on an AI Marketing Team. Look at recentContent and recentCampaigns',
  'in the brand context and suggest ONE specific customer follow-up action a human could take',
  'today — e.g. a segment to re-engage, a win-back message idea, a loyalty touch. There is no',
  'CRM system connected yet, so this is a suggestion for a human to act on manually, not an',
  'automated send.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export type CrmManagerInput = Record<string, never>
export interface CrmManagerOutput {
  segment: string
  followUpAction: string
}

export function buildCrmManagerUserPrompt(): string {
  return `Based on recentContent and recentCampaigns in the brand context, suggest ONE specific customer follow-up action for today.
JSON: {"segment": "who this targets, 1 short phrase", "followUpAction": "1-2 sentences, concrete"}`
}
