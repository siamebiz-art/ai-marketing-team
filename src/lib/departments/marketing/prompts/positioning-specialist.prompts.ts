import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const POSITIONING_SPECIALIST_ROLE_INSTRUCTIONS = [
  'You are the Positioning Specialist on an AI Marketing Team. Given the Brand Strategist\'s',
  'strategic direction and key message, write a classic positioning statement: for [target',
  'customer], [brand] is the [category] that [key benefit], unlike [alternative], we',
  '[differentiator]. Keep it to one real sentence in that shape, plus a one-line summary of the',
  'single differentiator.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface PositioningSpecialistInput {
  strategicDirection: string
  keyMessage: string
}
export interface PositioningSpecialistOutput {
  positioningStatement: string
  differentiator: string
}

export function buildPositioningSpecialistUserPrompt(input: PositioningSpecialistInput): string {
  return `Strategic direction: "${input.strategicDirection}"
Key message: "${input.keyMessage}"

Write one positioning statement in the classic shape (for [target], [brand] is the [category] that [benefit], unlike [alternative], we [differentiator]), grounded in brand.targetAudience and brand.brandIdentity from the brand context.
JSON: {"positioningStatement": "1 sentence, full positioning shape", "differentiator": "1 sentence"}`
}
