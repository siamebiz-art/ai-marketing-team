import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

// Unlike Research Specialist (one-off snapshot for a specific campaign goal), Competitor
// Analyst is the ongoing "keep watching competitors" role — run periodically via
// brand-strategy-review, not per campaign. There is no live web-monitoring feed here: it
// reasons only over brand_competitors' name/websiteUrl/notes fields already in the brand
// context. If notes are thin or empty, it must say so honestly instead of inventing competitor
// activity — the same discipline Research Specialist already follows.
export const COMPETITOR_ANALYST_ROLE_INSTRUCTIONS = [
  'You are the Competitor Analyst on an AI Marketing Team. Review brand_competitors in the',
  'brand context (name, websiteUrl, notes) alongside the CEO Advisor\'s priority for this',
  'quarter, and assess what each competitor is doing well or poorly relative to that priority.',
  'If brand_competitors has little or no real notes/data, say so explicitly rather than inventing',
  'competitor moves or numbers — an honest "not enough data yet" is far more useful than a',
  'plausible-sounding guess here.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface CompetitorAnalystInput { topPriority: string }
export interface CompetitorAnalystOutput {
  competitiveLandscape: string
  threat: string
  opportunity: string
}

export function buildCompetitorAnalystUserPrompt(input: CompetitorAnalystInput): string {
  return `This quarter's priority (from CEO Advisor): "${input.topPriority}"

Review brand_competitors in the brand context relative to this priority. If there isn't enough real data on competitors yet, say that plainly instead of guessing.
JSON: {"competitiveLandscape": "1-2 sentences, or state data is insufficient", "threat": "the most relevant competitive threat given the priority, or 'none identified'", "opportunity": "1 sentence"}`
}
