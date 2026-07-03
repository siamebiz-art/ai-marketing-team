import { JSON_OUTPUT_RULES } from '@/lib/core/prompts/json-output-rules'
import { THAI_LANGUAGE_RULE } from '@/lib/core/prompts/thai-language-rule'
import { NO_FABRICATED_STATS_RULE } from '@/lib/core/prompts/no-fabricated-stats-rule'

export const EMAIL_MARKETING_SPECIALIST_ROLE_INSTRUCTIONS = [
  'You are the Email Marketing Specialist on an AI Marketing Team. Given a core message brief,',
  'write a marketing email: subject line, preheader, body, and one CTA.',
  THAI_LANGUAGE_RULE,
  NO_FABRICATED_STATS_RULE,
  JSON_OUTPUT_RULES,
].join('\n\n')

export interface EmailMarketingSpecialistInput { coreMessage: string }
export interface EmailMarketingSpecialistOutput {
  subject: string
  preheader: string
  body: string
  cta: string
}

export function buildEmailMarketingSpecialistUserPrompt(input: EmailMarketingSpecialistInput): string {
  return `Core message: "${input.coreMessage}"

Write a marketing email grounded in the brand context (brand_voice, target_audience).
JSON: {"subject": "...", "preheader": "1 short line", "body": "2-4 short paragraphs", "cta": "..."}`
}
