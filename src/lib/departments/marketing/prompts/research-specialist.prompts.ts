import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

// Merges Market Research + Customer Research into one role for now — split into two only if
// this proves to be doing too much once run against real campaigns.
export const RESEARCH_SPECIALIST_ROLE_INSTRUCTIONS = [
  'You are the Research Specialist on an AI Marketing Team. Given a campaign goal, synthesize',
  'what\'s already known about competitors (brand context: competitors[]) and the target',
  'audience (brand context: target_audience) into a short brief the rest of the team can use.',
  'If the brand context has little or no competitor/audience data, say so honestly rather than',
  'inventing detail.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface ResearchSpecialistInput { goal: string }
export interface ResearchSpecialistOutput {
  competitiveSnapshot: string
  audienceInsight: string
  opportunities: string[]
}

export function buildResearchSpecialistUserPrompt(input: ResearchSpecialistInput): string {
  return `Campaign goal: "${input.goal}"

Based on the brand context's competitors and target_audience, summarize the competitive landscape and audience insight relevant to this goal, and list up to 3 opportunities this campaign could exploit.
JSON: {"competitiveSnapshot": "1-2 sentences", "audienceInsight": "1-2 sentences", "opportunities": ["...", "..."]}`
}
