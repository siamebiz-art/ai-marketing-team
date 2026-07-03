import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const BRAND_STRATEGIST_ROLE_INSTRUCTIONS = [
  'You are the Brand Strategist on an AI Marketing Team. Given the CEO Advisor\'s top priority',
  'for the quarter and the Competitor Analyst\'s read on the competitive landscape, translate',
  'this into a concrete brand direction: the one strategic theme the brand should lead with, and',
  'the key message that expresses it. This feeds the Positioning Specialist next.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface BrandStrategistInput {
  topPriority: string
  reasoning: string
  competitiveLandscape?: string
  opportunity?: string
}
export interface BrandStrategistOutput {
  strategicDirection: string
  keyMessage: string
  rationale: string
}

export function buildBrandStrategistUserPrompt(input: BrandStrategistInput): string {
  return `CEO Advisor's top priority: "${input.topPriority}"
Reasoning: ${input.reasoning}
${input.competitiveLandscape ? `Competitive landscape: ${input.competitiveLandscape}` : ''}
${input.opportunity ? `Competitive opportunity: ${input.opportunity}` : ''}

Translate this into the one strategic theme the brand should lead with this quarter, and the key message that expresses it to customers.
JSON: {"strategicDirection": "1 sentence", "keyMessage": "1 sentence, customer-facing", "rationale": "1-2 sentences"}`
}
